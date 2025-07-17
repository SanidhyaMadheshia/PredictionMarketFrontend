// lib/client.ts

// import { se } from "date-fns/locale";
import { createThirdwebClient } from "thirdweb";
import { getRpcUrlForChain, sepolia } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!; // this will be used on the client
const secretKey = process.env.THIRDWEB_SECRET_KEY!; // this will be used on the server-side

// export const client = createThirdwebClient(
//   secretKey ? { secretKey } : { clientId },
// );
export const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS!;
export const client = createThirdwebClient({
    clientId 
});
export const rpcURL = getRpcUrlForChain({
    chain : sepolia,
    client
})

// export const poolManagerAddressSeoplia = "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543";
