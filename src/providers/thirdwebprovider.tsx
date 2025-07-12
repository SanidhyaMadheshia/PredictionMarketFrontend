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

