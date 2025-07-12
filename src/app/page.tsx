'use client';
import "./landingPage.css"; // Import the CSS file for styling
import { contract } from "@/providers/thirdwebprovider"; // Adjust the import path as necessary
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "@/lib/client";
import { getUserRoleFromWallet } from "@/lib/auth";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";

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

  return isLoading ? (
    <div className="min-h-screen bg-gray-50 background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Web3 Prediction Market</h1>
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
              
              <ConnectButton client={client} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!account ? (
          // Not connected state
          <div className="text-center py-12">
            <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
              <div className="mb-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="mt-2 text-lg font-medium text-gray-900">Connect Your Wallet</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please connect your wallet to access the prediction market
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium text-blue-900">User Access</h3>
                  <p className="text-sm text-blue-700">Trade on active markets and manage your portfolio</p>
                </div>
                
                <div className="border rounded-lg p-4 bg-red-50">
                  <h3 className="font-medium text-red-900">Admin Access</h3>
                  <p className="text-sm text-red-700">Create markets, resolve outcomes, and manage the platform</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Connected state - show role-based dashboard
          <div>
            {user?.role === 'admin' ? (
              <AdminDashboard user={user} />
            ) : (
              <UserDashboard user={user } />
              // <div>
              //   helllo
              // </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}