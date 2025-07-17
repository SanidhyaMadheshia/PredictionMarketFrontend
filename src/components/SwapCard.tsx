import { client } from "@/lib/client";
import { getRpcUrlForChain, sepolia } from "thirdweb/chains";

function SwapCard () {

  const rpcurl = getRpcUrlForChain({
    chain : sepolia,
    client : client
  });
  

  console.log("RPCURL",rpcurl)
    return (
      //   <Card>
      //   <CardHeader>
      //     <CardTitle className="flex items-center gap-2">
      //       <ArrowRightLeft className="w-5 h-5" />
      //       Swap Tokens
      //     </CardTitle>
      //     <CardDescription>
      //       Exchange tokens at current market rates
      //     </CardDescription>
      //   </CardHeader>
      //   <CardContent className="space-y-4">
      //     {/* From Token */}
      //     <div className="space-y-2">
      //       <Label htmlFor="fromAmount">From</Label>
      //       <div className="flex gap-2">
      //         <Input
      //           id="fromAmount"
      //           type="number"
      //           placeholder="0.0"
      //           value={swapAmount}
      //           onChange={(e) => setSwapAmount(e.target.value)}
      //           className="flex-1"
      //         />
      //         <Badge variant="outline" className="px-3 py-1">
      //           {swapFromToken}
      //         </Badge>
      //       </div>
      //     </div>

      //     {/* Switch Button */}
      //     <div className="flex justify-center">
      //       <Button
      //         variant="outline"
      //         size="sm"
      //         onClick={switchTokens}
      //         className="rounded-full p-2"
      //       >
      //         <ArrowRightLeft className="w-4 h-4" />
      //       </Button>
      //     </div>

      //     {/* To Token */}
      //     <div className="space-y-2">
      //       <Label htmlFor="toAmount">To</Label>
      //       <div className="flex gap-2">
      //         <Input
      //           id="toAmount"
      //           type="number"
      //           placeholder="0.0"
      //           value={calculateReceiveAmount()}
      //           readOnly
      //           className="flex-1 bg-gray-50"
      //         />
      //         <Badge variant="outline" className="px-3 py-1">
      //           {swapToToken}
      //         </Badge>
      //       </div>
      //     </div>

      //     {/* Exchange Rate */}
      //     <div className="text-sm text-gray-600 text-center">
      //       {swapFromToken === 'ETH' ?
      //         `1 ETH = ${exchangeRates.ETH_TO_TOKEN} TOKENS` :
      //         `1 TOKEN = ${exchangeRates.TOKEN_TO_ETH} ETH`
      //       }
      //     </div>

      //     {/* Swap Button */}
      //     <Button
      //       onClick={handleSwap}
      //       disabled={loading || !swapAmount}
      //       className="w-full"
      //     >
      //       {loading ? 'Swapping...' : 'Swap Tokens'}
      //     </Button>
      //   </CardContent>
      // </Card>
      <div>
        swap tokns here 

      </div>
    )
}


export default SwapCard;
