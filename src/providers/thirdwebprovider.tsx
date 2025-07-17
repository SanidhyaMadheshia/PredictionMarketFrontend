import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { client } from "@/lib/client";
export const contract = getContract({
  client,
  address: "0xcc212e1ba6a9f4a80e1b974ccefd8089eae52cb1",
  chain: sepolia,
});

// const { data, isLoading } = useReadContract({
//   contract,
//   method: "function tokenURI(uint256 tokenId) returns (string)",
//   params: [BigInt(1)],
// });


export const sepoliaChain  = sepolia
export const tokenContract = getContract({
  client,
  address : "0x9920233f64F1BD459FC6ac52592b4d30AD8D1ccc",
  chain : sepolia
})