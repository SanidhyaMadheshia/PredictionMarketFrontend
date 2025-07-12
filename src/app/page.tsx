// // app/page.tsx
// "use client";
// import type { NextPage } from "next";
// import { ConnectButton, useReadContract } from "thirdweb/react";
// import { client } from "@/lib/client";
// import { Button } from "@/components/ui/button";

// import "./landingPage.css"; // Import the CSS file for styling
// // import {
  // //   generatePayload,
  // //   isLoggedIn,
  // //   login,
  // //   logout,
  // // } from "@/actions/login"; // we'll create this file in the next section
  
  // const Page = () => {
    //   const {data , isLoading} = useReadContract({
      //     contract,
      //     method: "function owner() view returns (address)",
      //   params: [],
      //   })
      //   return (
        //     <><div className="background">
        
        //       <ConnectButton
        //         client={client}
        
        //       />
        //     </div>
        //     <div>
        
        //     <Button
        //     onClick={()=>{
          //       if(!isLoading) {
            //         console.log(data);
            //       }
            //     }}
            //     >GET THE URI OF TOKEN </Button>
            //     </div>
            //     </>
            //   );
            // };
            
            // export default Page;
            
            
'use client';
import "./landingPage.css"; // Import the CSS file for styling
import { contract } from "@/providers/thirdwebprovider"; // Adjust the import path as necessary
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "@/lib/client";
import { getUserRoleFromWallet } from "@/lib/auth";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
// import UserDashboard from "@/components/dashboard/UserDashboard";
// import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function HomePage() {
  const account = useActiveAccount();
  const [user, setUser] = useState<User | null>(null);
    const {data , isLoading} = useReadContract({
      contract,
      method: "function owner() view returns (address)",
    params: [],
    })

  useEffect(() => {
    if (account?.address) {
      const role = getUserRoleFromWallet(account.address, data?.toLowerCase() || '');
      setUser({
        walletAddress: account.address,
        role,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`
      });
    } else {
      setUser(null);
    }
  }, [account]);

  return isLoading ? <div>
    <p>Loading...</p>
  </div> :
    
    <div className="min-h-screen bg-gray-50 background ">
      {/* Header */}
      <header className="bg-white shadow-sm border-b ">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Web3 Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user.name}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              )}
              
              <ConnectButton
                client={client}
                // appMetadata={{
                //   name: "Web3 Dashboard",
                //   url: "https://example.com",
                // }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!account ? (
          // Not connected state
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="mt-2 text-lg font-medium text-gray-900">Connect Your Wallet</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please connect your wallet to access the dashboard
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium text-blue-900">User Access</h3>
                  <p className="text-sm text-blue-700">Regular users can view and edit their data</p>
                </div>
                
                <div className="border rounded-lg p-4 bg-red-50">
                  <h3 className="font-medium text-red-900">Admin Access</h3>
                  <p className="text-sm text-red-700">Admins can manage users and system settings</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Connected state - show role-based dashboard
          <div>
            {user?.role === 'admin' ? (
              // <AdminDashboard user={user} />
              <div>
                admin 
              </div>
            ) : (
              // <UserDashboard user={user} />
              <div>
                user
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  ;
}