"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, TrendingUp, Trophy, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
//thirdweb imports
import {contract} from "@/providers/thirdwebprovider";
import { useReadContract } from "thirdweb/react";

// Types for the contract
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

const PredictionMarketInterface: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const [userShares, setUserShares] = useState<{ [key: number]: UserShares }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [newMarket, setNewMarket] = useState({
    question: '',
    optionA: '',
    optionB: '',
    duration: ''
  });
  const [betAmount, setBetAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockMarkets: Market[] = [
      {
        id: 0,
        question: "Will Bitcoin reach $100k by end of 2025?",
        optionA: "Yes",
        optionB: "No",
        endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        outcome: 'UNRESOLVED',
        totalStakedA: 1500,
        totalStakedB: 2300,
        isResolved: false
      },
      {
        id: 1,
        question: "Will Ethereum 2.0 be fully deployed by Q4 2025?",
        optionA: "Yes",
        optionB: "No",
        endTime: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
        outcome: 'UNRESOLVED',
        totalStakedA: 800,
        totalStakedB: 1200,
        isResolved: false
      }
    ];
    setMarkets(mockMarkets);
    
    // Mock user shares
    setUserShares({
      0: { optionAShares: 100, optionBShares: 0 },
      1: { optionAShares: 0, optionBShares: 50 }
    });
  }, []);

  const handleCreateMarket = async () => {
    if (!newMarket.question || !newMarket.optionA || !newMarket.optionB || !newMarket.duration) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would interact with the contract
      // const contract = new ethers.Contract(contractAddress, abi, signer);
      // await contract.createMarket(newMarket.question, newMarket.optionA, newMarket.optionB, newMarket.duration);
      
      setSuccess('Market created successfully!');
      setNewMarket({ question: '', optionA: '', optionB: '', duration: '' });
    } catch (err) {
      setError('Failed to create market');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyShares = async () => {
    if (!selectedMarket || !betAmount || !selectedOption) {
      setError('Please select a market, amount, and option');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would interact with the contract
      // const contract = new ethers.Contract(contractAddress, abi, signer);
      // await contract.buyShares(selectedMarket, selectedOption === 'A', betAmount);
      
      setSuccess(`Successfully bought ${betAmount} shares for Option ${selectedOption}!`);
      setBetAmount('');
      setSelectedOption(null);
    } catch (err) {
      setError('Failed to buy shares');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimWinnings = async (marketId: number) => {
    setLoading(true);
    try {
      // In a real app, this would interact with the contract
      // const contract = new ethers.Contract(contractAddress, abi, signer);
      // await contract.claimWinnings(marketId);
      
      setSuccess('Winnings claimed successfully!');
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
    const { data, isPending } = useReadContract({
    contract,
    method:
      "function markets(uint256) view returns (string question, uint256 endTime, uint8 outcome, string optionA, string optionB, uint256 totalStakedA, uint256 totalStakedB, bool isResolved)",
    params: [BigInt(0)], // Pass a valid market ID as bigint
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Prediction Market</h1>
          <p className="text-slate-600">Trade on the outcome of future events</p>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="markets">Active Markets</TabsTrigger>
            <TabsTrigger value="create">Create Market</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="markets" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {markets.map((market) => {
                const odds = getOdds(market.totalStakedA, market.totalStakedB);
                const isExpired = Date.now() > market.endTime;
                
                return (
                  <Card key={market.id} className="hover:shadow-lg transition-shadow">
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
                            <Trophy className="h-4 w-4 text-yellow-500" />
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

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Market</CardTitle>
                <CardDescription>
                  Create a new prediction market for others to trade on
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="What do you want people to predict?"
                    value={newMarket.question}
                    onChange={(e) => setNewMarket({...newMarket, question: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="optionA">Option A</Label>
                    <Input
                      id="optionA"
                      placeholder="e.g., Yes"
                      value={newMarket.optionA}
                      onChange={(e) => setNewMarket({...newMarket, optionA: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="optionB">Option B</Label>
                    <Input
                      id="optionB"
                      placeholder="e.g., No"
                      value={newMarket.optionB}
                      onChange={(e) => setNewMarket({...newMarket, optionB: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 2592000 (30 days)"
                    value={newMarket.duration}
                    onChange={(e) => setNewMarket({...newMarket, duration: e.target.value})}
                  />
                </div>
                <Button onClick={handleCreateMarket} disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Create Market'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {markets.map((market) => {
                const shares = userShares[market.id];
                if (!shares || (shares.optionAShares === 0 && shares.optionBShares === 0)) return null;

                return (
                  <Card key={market.id}>
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
    </div>
  );
};

export default PredictionMarketInterface;