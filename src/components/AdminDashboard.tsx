"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock, Users, Settings, Trophy, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contract } from "@/providers/thirdwebprovider";
import { useReadContract ,useSendTransaction} from "thirdweb/react";
import { User } from "@/types/auth";
import {prepareContractCall} from "thirdweb";

// import { contract } from '@/providers/thirdwebprovider';
// import { useReadContract } from 'thirdweb/react';
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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {


  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [marketIds, setMarketIds] = useState<number[]>([]);
  const {data : marketCount, isLoading: isMarketCountLoading} = useReadContract({
      contract,
      method : "function marketCount() view returns (uint256)",
      params: []
  });
  useEffect(()=>{
    setMarketIds(Array.from({ length: Number(marketCount) }, (_,i)=> i+1));

  },[marketCount]);

    const [newMarket, setNewMarket] = useState({
      question: '',
      optionA: '',
      optionB: '',
      duration: ''
    });

  const {
  mutate: sendTransactionCreateMarket,
  data: txnResult,
  isPending,
  isSuccess,
  isError,
  error : txnError
} = useSendTransaction();




// const { data : marketInfo, isPending : maketInfoPending} = useReadContract({
//   contract,
  
//   method:
//     "function getMarketInfo(uint256 _marketId) view returns (string question, string optionA, string optionB, uint256 endTime, uint8 outcome, uint256 totalOptionAShares, uint256 totalOptionBShares, bool isResolved)",
//   params: [BigInt(1)],
// });

// const { data : marketInfo, isPending : maketInfoPending} = useReadContract({
//   contract,
//   method : "multicall"
// })

// console.log("marketInfo", marketInfo);
  // useEffect(() => {
  // }, [marketCount]);
const results = marketIds.map((id) =>
  useReadContract({
    contract,
    method:
      "function marketInfoWithId(uint256) view returns (MarketInfoStruct)",
    params: [BigInt(id)],
  }),
);

console.log(results)

// setMarkets(results.map((result , index)=>{
  
// }))


  useEffect(() => {
  if (isPending) {
    setLoading(true);
    setSuccess(null);
    setError(null);
  } else if (isSuccess) {
    setLoading(false);
    setSuccess("Market created successfully!");
    setNewMarket({ question: "", optionA: "", optionB: "", duration: "" });
  } else if (isError) {
    setLoading(false);
    setError(txnError?.message || "Failed to create market");
  }
}, [isPending, isSuccess, isError, error]);
  const handleCreateMarket = async () => {
    if (!newMarket.question || !newMarket.optionA || !newMarket.optionB || !newMarket.duration) {
      setError('Please fill in all fields');
      return;
    }
    const transaction = prepareContractCall({
      contract,
      method:
        "function createMarket(string _question, string _optionA, string _optionB, uint256 _duration) returns (uint256)",
      params: [newMarket.question,
        newMarket.optionA, 
        newMarket.optionB, newMarket.duration ? BigInt(newMarket.duration) : BigInt(0)],
    });
    sendTransactionCreateMarket(transaction);
  };

  const handleResolveMarket = async (marketId: number, outcome: 'OPTION_A' | 'OPTION_B') => {
    setLoading(true);
    try {
      // Update the market in the state
      setMarkets(prev => prev.map(market => 
        market.id === marketId 
          ? { ...market, outcome, isResolved: true }
          : market
      ));
      setSuccess(`Market #${marketId} resolved successfully!`);
      setError(null);
    } catch (err) {
      setError('Failed to resolve market');
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
        {/* <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2> */}
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
                {isMarketCountLoading ? <Loader/> : 
                    <div className="text-2xl font-bold">{marketCount}</div>
                }   
              </CardContent>
            </Card>
            
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {markets.map((market) => {
              const odds = getOdds(market.totalStakedA, market.totalStakedB);
              const isExpired = Date.now() > market.endTime;
              
              return (
                <Card key={market.id} className ="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
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
                        <Button
                          onClick={() => handleResolveMarket(market.id, 'OPTION_A')}
                          disabled={loading}
                          className="flex-1"
                          variant="outline"
                        >
                          {market.optionA} Wins
                        </Button>
                        <Button
                          onClick={() => handleResolveMarket(market.id, 'OPTION_B')}
                          disabled={loading}
                          className="flex-1"
                          variant="outline"
                        >
                          {market.optionB} Wins
                        </Button>
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