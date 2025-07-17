    import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertCircle, Coins, CheckCircle } from 'lucide-react';
import { useSendTransaction } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { tokenContract } from '@/providers/thirdwebprovider';
import { se } from 'date-fns/locale';
import SwapCard from '../SwapCard';
interface AdminProps {
  adminTokens: number;
  adminEth: number;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showMessage: (msg: string, type: string) => void;
  adminAddress: string;
}

const Admin: React.FC<AdminProps> = ({
  adminTokens,
  adminEth,
  loading,
  setLoading,
  showMessage,
  adminAddress
}) => {
  // Admin mint state
  const [mintAmount, setMintAmount] = useState('');

  // const handleMintTokens = async () => {
  //   if (!mintAmount || parseFloat(mintAmount) <= 0) {
  //     showMessage('Please enter a valid mint amount', 'error');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     // Simulate API call delay
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     const amount = parseFloat(mintAmount);
  //     setAdminTokens(prev => prev + amount);
  //     showMessage(`Successfully minted ${amount} TOKENS to admin account`, 'success');
  //     setMintAmount('');

  //   } catch (error) {
  //     showMessage('Mint failed. Please try again.', 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleCreateMarket = async () => {
  //     if (!newMarket.question || !newMarket.optionA || !newMarket.optionB || !newMarket.duration) {
  //       setError('Please fill in all fields');
  //       return;
  //     }
  //     const transaction = prepareContractCall({
  //       contract,
  //       method:
  //         "function createMarket(string _question, string _optionA, string _optionB, uint256 _duration) returns (uint256)",
  //       params: [newMarket.question,
  //         newMarket.optionA, 
  //         newMarket.optionB, newMarket.duration ? BigInt(newMarket.duration) : BigInt(0)],
  //     });
  //     sendTransactionCreateMarket(transaction);
  //   };
  const {
      mutate: sendTransactionMintTokens,
      data: txnResult,
      isPending,
      isSuccess,
      isError,
      error : txnError
    } = useSendTransaction();
  function handleMintTokens() {
    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      showMessage('Please enter a valid mint amount', 'error');
      return;
    }
    const amount = BigInt(
      parseFloat(mintAmount) * 10 ** 18
    ).toString();
    setLoading(true);

    const txn = prepareContractCall({
      contract : tokenContract,
      method: "function mintTo(address to, uint256 amount)",
      params : [adminAddress, BigInt(amount)]

    });

    sendTransactionMintTokens(txn);

    setLoading(false);
    console.log("Minting tokens: ", mintAmount, " to address: ", adminAddress, "result : " ,  txnResult);
  }

  return (
    <>
  {/* balance card  */}
    <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Your Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">ETH</span>
            <Badge variant="secondary">{adminEth.toFixed(6)}</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">TOKENS</span>
            <Badge variant="secondary">{adminTokens.toFixed(2)}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Swap Card */}
      
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Admin Panel
        </CardTitle>
        <CardDescription>
          Mint new tokens to the admin account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Admin Balance */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-900">Admin Token Balance</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {adminTokens.toFixed(2)} TOKENS
            </Badge>
          </div>
        </div>

        {/* Mint Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mintAmount">Mint Amount</Label>
            <Input
              id="mintAmount"
              type="number"
              placeholder="Enter amount to mint"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
          </div>

          <Button
            onClick={handleMintTokens}
            disabled={loading || !mintAmount}
            className="w-full"
          >
            {isPending ? 'Minting...' : 'Mint Tokens'}
          </Button>
          {isSuccess && (
            <Alert className="mt-4">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Successfully minted {mintAmount} TOKENS to admin account.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Warning */}
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            This action will mint new tokens directly to the admin account. Use with caution.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>

    <SwapCard/>

    
    </>
  );
};

export default Admin;