
"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import "../landingPage.css"
import { ConnectButton, useActiveAccount, useActiveWallet, useChainMetadata, useReadContract, useWalletBalance } from 'thirdweb/react';
import { client, tokenAddress } from '@/lib/client';
import { contract, tokenContract } from '@/providers/thirdwebprovider';
import User from '@/components/buyTokens/User';
import Admin from '@/components/buyTokens/Admin';
import { sepolia } from 'thirdweb/chains';
import { GetBalanceResult } from 'thirdweb/extensions/erc20';
// import {client} from "@/lib/client"
const TokenSwapApp = () => {
  const [adminTokens, setAdminTokens] = useState(1000);
  const [isAdmin, setIsAdmin] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // User state
  const [userTokensObject, setUserTokensObject] = useState<GetBalanceResult>();
  const [userEthObject, setUserEthObject] = useState<GetBalanceResult>();
  const [userTokens, setUserTokens]= useState<string | null>();
  const [userEth, setUserEth]= useState<string | null>();
  const userAddress= useActiveAccount()?.address;

  const {data : usereths , isLoading : isLoadingUserEths} = useWalletBalance({
    client,
    address : useActiveAccount()?.address,
    chain : sepolia
  });

  const {data : usertokens , isLoading : isLoadingUserTokens} = useWalletBalance({
    client,
    tokenAddress : tokenAddress,
    address :useActiveAccount()?.address,
    chain : sepolia
  });



  useEffect(()=>{
    // setUserEthObject(usereths);
    console.log("eths : ", usereths );
    setUserEthObject(usereths);
    setUserEth(usereths?.displayValue);
    console.log(userEth)




  },[usereths]);

  useEffect(()=>{
    // setUserEth(usereths) ;
    console.log("usertokens :", usertokens);
    setUserTokensObject(usertokens);
    setUserTokens(usertokens?.displayValue);

  },[usertokens]);
  



  



  
  
  const { data : ownerAddress, isLoading :  ownerAddressLoading } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });



  // useEffect(() => {
  //   console.log(currentUserTokens);
  //   // setUserTokens(Number(currentUserTokens));
  // }, [currentUserTokens]);

  // Admin state
  useEffect(()=>{
    setIsAdmin(()=> ownerAddress===userAddress);
    console.log("ownerAddress: ", ownerAddress);
    console.log("userAddress: ", userAddress);

  },[ownerAddress,userAddress]);

  const showMessage = (msg: string, type: string) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };
//   useEffect(() => {
//   console.log('usereths data:', userEth);
//   console.log('usertokens data:', userTokens);
//   console.log('userAddress:', userAddress);
// }, [userEth, userTokens, userAddress]);
  
  return  ownerAddressLoading  || isLoadingUserEths || isLoadingUserTokens ? (
    <div className="min-h-screen bg-gray-50 background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 background">
      <div className="">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Token Swap Platform</h1>
              </div>

              <div className="flex items-center space-x-4">
                <ConnectButton client={client} />
              </div>
            </div>
          </div>
        </header>

        {/* Admin Toggle */}
       

        {/* Message Alert */}
        {message && (
          <Alert className={`mb-6 ${messageType === 'error' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
            {messageType === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            <AlertDescription className={messageType === 'error' ? 'text-red-700' : 'text-green-700'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Role-based Component Rendering */}
        {isAdmin ? (
          <Admin
            adminTokens={userTokens? Number(userTokens) : 0}
            adminEth={userEth? Number(userEth) : 0}
            loading={loading}
            setLoading={setLoading}
            showMessage={showMessage}
            adminAddress={ownerAddress ? ownerAddress : ""}
          />
        ) 
        : 
        (
          <User
            userTokens={userTokens? Number(userTokens) : 0}
            userEth={userEth? Number(userEth) : 0}
            loading={loading}
            setLoading={setLoading}
            showMessage={showMessage}
          />
        )}
        
      </div>
    </div>
  );
};

export default TokenSwapApp;