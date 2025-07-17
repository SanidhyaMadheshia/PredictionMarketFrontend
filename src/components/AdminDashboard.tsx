"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, Users, Settings, Trophy, CheckCircle, Loader, CalendarDays } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contract } from "@/providers/thirdwebprovider";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { User } from "@/types/auth";
import { prepareContractCall, readContract } from "thirdweb";

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

interface AdminDashboardProps {
  user: User;
}

const DurationSelector = ({ onDurationChange, error }: {
  onDurationChange: (durationInSeconds: number) => void;
  error?: string;
}) => {
  const [durationType, setDurationType] = useState('relative');
  const [relativeDuration, setRelativeDuration] = useState('');
  const [relativeUnit, setRelativeUnit] = useState('hours');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const getRelativeDurationInSeconds = () => {
    if (!relativeDuration) return 0;
    
    const multipliers: Record<string, number> = {
      minutes: 60,
      hours: 3600,
      days: 86400,
      weeks: 604800
    };
    
    return parseInt(relativeDuration) * multipliers[relativeUnit];
  };

  const getAbsoluteDurationInSeconds = () => {
    if (!endDate || !endTime) return 0;
    
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const now = new Date();
    const diffMs = endDateTime.getTime() - now.getTime();
    
    return Math.max(0, Math.floor(diffMs / 1000));
  };

  const handleDurationChange = () => {
    let durationInSeconds;
    
    if (durationType === 'relative') {
      durationInSeconds = getRelativeDurationInSeconds();
    } else {
      durationInSeconds = getAbsoluteDurationInSeconds();
    }
    
    onDurationChange(durationInSeconds);
  };

  React.useEffect(() => {
    handleDurationChange();
  }, [durationType, relativeDuration, relativeUnit, endDate, endTime]);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const today = new Date();
    const selectedDate = new Date(endDate);
    
    if (selectedDate.toDateString() === today.toDateString()) {
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes() + 1).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    return '';
  };

  return (
    <div className="space-y-2">
      <Label>Market Duration</Label>
      <div className="border rounded-lg p-4">
        <Tabs value={durationType} onValueChange={setDurationType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="relative">Duration</TabsTrigger>
            <TabsTrigger value="absolute">End Date</TabsTrigger>
          </TabsList>
          
          <TabsContent value="relative" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <div className="flex gap-2">
                <Input
                  id="duration"
                  type="number"
                  placeholder="Enter duration"
                  value={relativeDuration}
                  onChange={(e) => setRelativeDuration(e.target.value)}
                  min="1"
                  className="flex-1"
                />
                <Select value={relativeUnit} onValueChange={setRelativeUnit}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {relativeDuration && (
                <p className="text-sm text-gray-600">
                  Market will end in {relativeDuration} {relativeUnit}
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="absolute" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <div className="relative">
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={getMinDate()}
                    className="pl-10"
                  />
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    min={getMinTime()}
                    className="pl-10"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              {endDate && endTime && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    Market will end on {new Date(`${endDate}T${endTime}`).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600">
            <strong>Duration:</strong> {durationType === 'relative' ? getRelativeDurationInSeconds() : getAbsoluteDurationInSeconds()} seconds
          </p>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [marketIds, setMarketIds] = useState<number[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [resolvingMarketId, setResolvingMarketId] = useState<number | null>(null);
const [resolvedMarketIds, setResolvedMarketIds] = useState<Set<number>>(new Set());
  
  const { data: marketCount, isLoading: isMarketCountLoading } = useReadContract({
    contract,
    method: "function marketCount() view returns (uint256)",
    params: []
  });

  const [newMarket, setNewMarket] = useState({
    question: '',
    optionA: '',
    optionB: '',
    duration: 0
  });

  const {
    mutate: sendTransactionCreateMarket,
    data: txnResult,
    isPending,
    isSuccess,
    isError,
    error: txnError
  } = useSendTransaction();

  const {
    mutate : sendResolveMarket,
    data  : resolveTxnResult,
    isPending : isResolvePending,
    isSuccess : isResolveSuccess,
    isError : isResolveError,
    error : resolveTxnError
  }= useSendTransaction();



  // Generate market IDs when marketCount changes
  useEffect(() => {
    if (marketCount) {
      setMarketIds(Array.from({ length: Number(marketCount) }, (_, i) => i + 1));
    }
  }, [marketCount]);

  // Fetch market data when marketIds change
  useEffect(() => {
    const fetchMarketData = async () => {
      if (marketIds.length === 0) return;
      
      try {
        const data = await Promise.all(
          marketIds.map(async (id) => {
            const result = await readContract({
              contract,
              method: "function getMarketInfo(uint256 _marketId) view returns (string question, string optionA, string optionB, uint256 endTime, uint8 outcome, uint256 totalOptionAShares, uint256 totalOptionBShares, bool isResolved)",
              params: [BigInt(id)],
            });
            return result;
          })
        );
        
        setResults(data);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setError("Failed to fetch market data");
      }
    };

    fetchMarketData();
  }, [marketIds]);

  // Process results into markets
  useEffect(() => {
    if (results.length === 0) return;
    
    const processedMarkets: Market[] = results.map((result: any[], index: number) => {
      const [question, optionA, optionB, endTime, outcome, totalOptionAShares, totalOptionBShares, isResolved] = result;
      
      return {
        id: index + 1,
        question: String(question),
        optionA: String(optionA),
        optionB: String(optionB),
        endTime: typeof endTime === 'bigint' ? Number(endTime) * 1000 : Number(endTime) * 1000, // Convert to milliseconds
        outcome: String(outcome) === "0" ? 'UNRESOLVED' : String(outcome) === "1" ? 'OPTION_A' : 'OPTION_B',
        totalStakedA: typeof totalOptionAShares === 'bigint' ? Number(totalOptionAShares) : Number(totalOptionAShares),
        totalStakedB: typeof totalOptionBShares === 'bigint' ? Number(totalOptionBShares) : Number(totalOptionBShares),
        isResolved: Boolean(isResolved)
      };
    });
    
    setMarkets(processedMarkets);
  }, [results]);

  // Handle transaction state changes
  useEffect(() => {
    if (isResolveSuccess && resolvingMarketId) {
      setResolvedMarketIds(prev => new Set(prev).add(resolvingMarketId));
      setMarkets(prev => prev.map(market =>
        market.id === resolvingMarketId
          ? { ...market, isResolved: true }
          : market
      ));
      setSuccess(`Market #${resolvingMarketId} resolved successfully!`);
      setResolvingMarketId(null);
    } else if (isResolveError) {
      setError(resolveTxnError?.message || "Failed to resolve market");
      setResolvingMarketId(null);
    }
  }, [isResolveSuccess, isResolveError, resolvingMarketId, resolveTxnError]);


  useEffect(() => {
    if (isPending) {
      setLoading(true);
      setSuccess(null);
      setError(null);
    } else if (isSuccess) {
      setLoading(false);
      setSuccess("Market created successfully!");
      setNewMarket({ question: "", optionA: "", optionB: "", duration: 0 });
    } else if (isError) {
      setLoading(false);
      setError(txnError?.message || "Failed to create market");
    }
  }, [isPending, isSuccess, isError, txnError]);

  const handleCreateMarket = async () => {
    if (!newMarket.question || !newMarket.optionA || !newMarket.optionB || !newMarket.duration) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const transaction = prepareContractCall({
        contract,
        method: "function createMarket(string _question, string _optionA, string _optionB, uint256 _duration) returns (uint256)",
        params: [
          newMarket.question,
          newMarket.optionA,
          newMarket.optionB,
          BigInt(newMarket.duration)
        ],
      });
      
      sendTransactionCreateMarket(transaction);
    } catch (err) {
      setError('Failed to prepare transaction');
    }
  };

  const handleResolveMarket = async (marketId: number, outcome: 'OPTION_A' | 'OPTION_B') => {
    setResolvingMarketId(marketId);
    try {
      const transaction = prepareContractCall({
        contract,
        method: "function resolveMarket(uint256 _marketId, uint8 _outcome)",
        params: [BigInt(marketId), Number(outcome === 'OPTION_A' ? 1 : 2)]
      });
      sendResolveMarket(transaction);
    } catch (err) {
      setError('Failed to resolve market');
      setResolvingMarketId(null);
    }
  };


  const handleDurationChange = (durationInSeconds: number) => {
    setNewMarket(prev => ({
      ...prev,
      duration: durationInSeconds
    }));
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

  const unresolvedMarkets = markets.filter(m => !m.isResolved);
  const resolvedMarkets = markets.filter(m => m.isResolved);
  const expiredMarkets = markets.filter(m => Date.now() > m.endTime && !m.isResolved);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-gray-100">Welcome back, {user.name}! Manage prediction markets and resolve outcomes.</p>
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Market</TabsTrigger>
          <TabsTrigger value="resolve">Resolve Markets</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Markets</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isMarketCountLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">{marketCount?.toString() || '0'}</div>
                )}   
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {markets.map((market) => {
              const odds = getOdds(market.totalStakedA, market.totalStakedB);
              const isExpired = Date.now() > market.endTime;
              
              return (
                <Card key={market.id} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg leading-tight">{market.question}</CardTitle>
                      <div className="flex gap-2">
                        {market.isResolved && <Badge variant="default">Resolved</Badge>}
                        {!market.isResolved && isExpired && <Badge variant="destructive">Expired</Badge>}
                        {!market.isResolved && !isExpired && <Badge variant="secondary">Active</Badge>}
                      </div>
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
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        Total Pool: {market.totalStakedA + market.totalStakedB} tokens
                      </span>
                    </div>

                    {market.isResolved && (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">
                          Winner: {market.outcome === 'OPTION_A' ? market.optionA : market.optionB}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Create New Market</CardTitle>
              <CardDescription>
                Create a new prediction market for users to trade on
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
              <DurationSelector 
                onDurationChange={handleDurationChange}
                error={error}
              />
              <Button onClick={handleCreateMarket} disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create Market'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resolve" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {expiredMarkets.map((market) => {
              const odds = getOdds(market.totalStakedA, market.totalStakedB);
              
              return (
                <Card key={market.id} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{market.question}</CardTitle>
                    <CardDescription>
                      Market expired on {formatTime(market.endTime)}
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
                    
                    <div className="space-y-2">
                      <Label>Resolve Market</Label>
                      <div className="flex gap-2">
                        {resolvingMarketId === market.id && isResolvePending ? (
                          <div className="flex items-center gap-2">
                            <Loader className="h-6 w-6 animate-spin" />
                            <span className="text-sm text-gray-600">Resolving...</span>
                          </div>
                        ) : resolvedMarketIds.has(market.id) ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            <span className="text-sm text-green-600">Market resolved!</span>
                          </div>
                        ) : resolvingMarketId === market.id && isResolveError ? (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                            <span className="text-sm text-red-600">Failed to resolve</span>
                          </div>
                        ) : (
                          <div className="space-y-2 w-full">
                            <span className="text-sm text-gray-600">Choose an outcome</span>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleResolveMarket(market.id, 'OPTION_A')}
                                disabled={resolvingMarketId === market.id}
                                className="flex-1"
                                variant="outline"
                              >
                                {market.optionA} Wins
                              </Button>
                              <Button
                                onClick={() => handleResolveMarket(market.id, 'OPTION_B')}
                                disabled={resolvingMarketId === market.id}
                                className="flex-1"
                                variant="outline"
                              >
                                {market.optionB} Wins
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {expiredMarkets.length === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No markets need resolution at this time.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {resolvedMarkets.map((market) => {
              const odds = getOdds(market.totalStakedA, market.totalStakedB);
              
              return (
                <Card key={market.id} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{market.question}</CardTitle>
                    <CardDescription>
                      Resolved on {formatTime(market.endTime)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">
                        Winner: {market.outcome === 'OPTION_A' ? market.optionA : market.optionB}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        Total Pool: {market.totalStakedA + market.totalStakedB} tokens
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`p-3 rounded-lg ${market.outcome === 'OPTION_A' ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <div className={`font-semibold ${market.outcome === 'OPTION_A' ? 'text-green-900' : 'text-gray-600'}`}>
                          {market.optionA}
                        </div>
                        <div className={`text-sm ${market.outcome === 'OPTION_A' ? 'text-green-600' : 'text-gray-500'}`}>
                          {market.totalStakedA} tokens
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${market.outcome === 'OPTION_B' ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <div className={`font-semibold ${market.outcome === 'OPTION_B' ? 'text-green-900' : 'text-gray-600'}`}>
                          {market.optionB}
                        </div>
                        <div className={`text-sm ${market.outcome === 'OPTION_B' ? 'text-green-600' : 'text-gray-500'}`}>
                          {market.totalStakedB} tokens
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {resolvedMarkets.length === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resolved markets yet</h3>
                    <p className="text-gray-600">Resolved markets will appear here once you start resolving expired markets.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;