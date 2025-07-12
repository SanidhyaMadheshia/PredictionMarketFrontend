// app/page.tsx
"use client";
import type { NextPage } from "next";
import { ConnectButton, useReadContract } from "thirdweb/react";
import { client } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { contract } from "@/providers/thirdwebprovider"; // Adjust the import path as necessary

import "./landingPage.css"; // Import the CSS file for styling
// import {
//   generatePayload,
//   isLoggedIn,
//   login,
//   logout,
// } from "@/actions/login"; // we'll create this file in the next section

const Page = () => {
  const {data , isLoading} = useReadContract({
    contract,
    method: "function owner() view returns (address)",
  params: [],
  })
  return (
    <><div className="background">

      <ConnectButton
        client={client}
        
      />
    </div>
    <div>

    <Button
    onClick={()=>{
      if(!isLoading) {
        console.log(data);
      }
    }}
    >GET THE URI OF TOKEN </Button>
    </div>
    </>
  );
};

export default Page;
