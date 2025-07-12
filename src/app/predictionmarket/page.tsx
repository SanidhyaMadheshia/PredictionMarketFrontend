import PredictionMarketInterface from "@/components/PredictionMarketInterface"
import { ConnectButton } from "thirdweb/react";
import {client} from "@/lib/client";
const Page = () => {
    return (
        <div>
            <ConnectButton
                  client={client}
                  
                />
            <PredictionMarketInterface />
        </div>
    )
}

export default Page;