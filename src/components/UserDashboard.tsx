"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { contract } from "@/providers/thirdwebprovider";
import { useReadContract } from "thirdweb/react";
import { User } from "@/types/auth";

interface Market {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  endTime: number;
  outcome: 'UNRESOLVED' | 'OPTION_A' | 'OPTION_B';
  totalStakedA: number;
  totalStakedB: number;
  isResolved: boolean;
}

interface UserShares {
  optionAShares: number;
  optionBShares: number;
}

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [userShares, setUserShares] = useState<{ [key: number]: UserShares }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading admin data...</p>
      </div>
    );
  }
  // const { data, isPending } = useReadContract({
  //   contract,
  //   method: "function markets(uint256) view returns (string question, uint256 endTime, uint8 outcome, string optionA, string optionB, uint256 totalStakedA, uint256 totalStakedB, bool isResolved)",
  //   params: [BigInt(0)],
  // });

  // Mock data for demonstration
  // useEffect(() => {
  //   const mockMarkets: Market[] = [
  //     {
  //       id: 0,
  //       question: "Will Bitcoin reach $100k by end of 2025?",
  //       optionA: "Yes",
  //       optionB: "No",
  //       endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
  //       outcome: 'UNRESOLVED',
  //       totalStakedA: 1500,
  //       totalStakedB: 2300,
  //       isResolved: false
  //     },
  //     {
  //       id: 1,
  //       question: "Will Ethereum 2.0 be fully deployed by Q4 2025?",
  //       optionA: "Yes",
  //       optionB: "No",
  //       endTime: Date.now() + 45 * 24 * 60 * 60 * 1000,
  //       outcome: 'UNRESOLVED',
  //       totalStakedA: 800,
  //       totalStakedB: 1200,
  //       isResolved: false
  //     }
  //   ];
  //   setMarkets(mockMarkets);
    
  //   // Mock user shares
  //   setUserShares({
  //     0: { optionAShares: 100, optionBShares: 0 },
  //     1: { optionAShares: 0, optionBShares: 50 }
  //   });
  // }, []);

  const handleBuyShares = async () => {
    if (!selectedMarket || !betAmount || !selectedOption) {
      setError('Please select a market, amount, and option');
      return;
    }

    setLoading(true);
    try {
      setSuccess(`Successfully bought ${betAmount} shares for Option ${selectedOption}!`);
      setBetAmount('');
      setSelectedOption(null);
      setError(null);
    } catch (err) {
      setError('Failed to buy shares');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimWinnings = async (marketId: number) => {
    setLoading(true);
    try {
      setSuccess('Winnings claimed successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to claim winnings');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getOdds = (totalA: number, totalB: number) => {
    const total = totalA + totalB;
    if (total === 0) return { oddsA: 50, oddsB: 50 };
    return {
      oddsA: Math.round((totalA / total) * 100),
      oddsB: Math.round((totalB / total) * 100)
    };
  };
  

  return (
    <div className="w-full">
      <div className="mb-6">
        {/* <h2 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h2> */}
        <p className="text-gray-100">Welcome back, {user.name}! Trade on prediction markets and manage your portfolio.</p>
      </div>

      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="markets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="markets">Active Markets</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {markets.map((market) => {
              const odds = getOdds(market.totalStakedA, market.totalStakedB);
              const isExpired = Date.now() > market.endTime;
              
              return (
                <Card key={market.id} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg leading-tight">{market.question}</CardTitle>
                      {isExpired && <Badge variant="destructive">Expired</Badge>}
                      {!isExpired && <Badge variant="secondary">Active</Badge>}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Ends: {formatTime(market.endTime)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-900">{market.optionA}</div>
                        <div className="text-sm text-blue-600">{odds.oddsA}% chance</div>
                        <div className="text-xs text-blue-500">{market.totalStakedA} tokens</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="font-semibold text-red-900">{market.optionB}</div>
                        <div className="text-sm text-red-600">{odds.oddsB}% chance</div>
                        <div className="text-xs text-red-500">{market.totalStakedB} tokens</div>
                      </div>
                    </div>
                    
                    {!isExpired && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={selectedMarket === market.id ? betAmount : ''}
                            onChange={(e) => {
                              setSelectedMarket(market.id);
                              setBetAmount(e.target.value);
                            }}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedMarket === market.id && selectedOption === 'A' ? 'default' : 'outline'}
                            onClick={() => {
                              setSelectedMarket(market.id);
                              setSelectedOption('A');
                              handleBuyShares();
                            }}
                            disabled={loading}
                            className="flex-1"
                          >
                            Bet on {market.optionA}
                          </Button>
                          <Button
                            variant={selectedMarket === market.id && selectedOption === 'B' ? 'default' : 'outline'}
                            onClick={() => {
                              setSelectedMarket(market.id);
                              setSelectedOption('B');
                              handleBuyShares();
                            }}
                            disabled={loading}
                            className="flex-1"
                          >
                            Bet on {market.optionB}
                          </Button>
                        </div>
                      </div>
                    )}

                    {market.isResolved && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">
                            Winner: {market.outcome === 'OPTION_A' ? market.optionA : market.optionB}
                          </span>
                        </div>
                        <Button onClick={() => handleClaimWinnings(market.id)} disabled={loading} className="w-full">
                          Claim Winnings
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {markets.map((market) => {
              const shares = userShares[market.id];
              if (!shares || (shares.optionAShares === 0 && shares.optionBShares === 0)) return null;

              return (
                <Card key={market.id} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{market.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Your Position:</span>
                      <div className="flex gap-2">
                        {shares.optionAShares > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {market.optionA}: {shares.optionAShares}
                          </Badge>
                        )}
                        {shares.optionBShares > 0 && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            {market.optionB}: {shares.optionBShares}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        Total Pool: {market.totalStakedA + market.totalStakedB} tokens
                      </span>
                    </div>
                    {market.isResolved && (
                      <Button onClick={() => handleClaimWinnings(market.id)} className="w-full">
                        Claim Winnings
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;