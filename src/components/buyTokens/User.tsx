import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Coins } from 'lucide-react';

interface UserProps {
  userTokens: number;
  userEth: number;

  loading: boolean;
  setLoading: (loading: boolean) => void;
  showMessage: (msg: string, type: string) => void;
}

const User: React.FC<UserProps> = ({
  userTokens,
  userEth,
  loading,
  setLoading,
  showMessage
}) => {
  // Swap state
  const [swapAmount, setSwapAmount] = useState('');
  const [swapFromToken, setSwapFromToken] = useState('ETH');
  const [swapToToken, setSwapToToken] = useState('MPT');

  // Exchange rates (simplified)
  const exchangeRates = {
    'ETH_TO_TOKEN': 100, // 1 ETH = 100 TOKENS
    'TOKEN_TO_ETH': 0.01, // 1 TOKEN = 0.01 ETH
  };

  // const handleSwap = async () => {
  //   if (!swapAmount || parseFloat(swapAmount) <= 0) {
  //     showMessage('Please enter a valid amount', 'error');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     // Simulate API call delay
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     const amount = parseFloat(swapAmount);

  //     if (swapFromToken === 'ETH' && swapToToken === 'TOKEN') {
  //       // ETH to TOKEN swap
  //       if (amount > userEth) {
  //         showMessage('Insufficient ETH balance', 'error');
  //         setLoading(false);
  //         return;
  //       }

  //       const tokensToReceive = amount * exchangeRates.ETH_TO_TOKEN;
  //       setUserEth(prev => prev - amount);
  //       setUserTokens(prev => prev + tokensToReceive);
  //       showMessage(`Successfully swapped ${amount} ETH for ${tokensToReceive} TOKENS`, 'success');

  //     } else if (swapFromToken === 'TOKEN' && swapToToken === 'ETH') {
  //       // TOKEN to ETH swap
  //       if (amount > userTokens) {
  //         showMessage('Insufficient TOKEN balance', 'error');
  //         setLoading(false);
  //         return;
  //       }

  //       const ethToReceive = amount * exchangeRates.TOKEN_TO_ETH;
  //       setUserTokens(prev => prev - amount);
  //       setUserEth(prev => prev + ethToReceive);
  //       showMessage(`Successfully swapped ${amount} TOKENS for ${ethToReceive} ETH`, 'success');
  //     }

  //     setSwapAmount('');

  //   } catch (error) {
  //     showMessage('Swap failed. Please try again.', 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const switchTokens = () => {
  //   setSwapFromToken(swapToToken);
  //   setSwapToToken(swapFromToken);
  // };

  const calculateReceiveAmount = () => {
    if (!swapAmount) return '0';
    const amount = parseFloat(swapAmount);
    if (swapFromToken === 'ETH' && swapToToken === 'TOKEN') {
      return (amount * exchangeRates.ETH_TO_TOKEN).toFixed(2);
    } else if (swapFromToken === 'TOKEN' && swapToToken === 'ETH') {
      return (amount * exchangeRates.TOKEN_TO_ETH).toFixed(6);
    }
    return '0';
  };
  useEffect(()=>{
    console.log(userEth);

  },[userEth]);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Balance Card */}
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
            <Badge variant="secondary">{userEth.toFixed(6)}</Badge>
            
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">TOKENS</span>
            <Badge variant="secondary">{userTokens.toFixed(2)}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Swap Card */}
      
    </div>
  );
};

export default User;

