import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  getJsonRpcUrl, ethers
} from "forta-agent";


import { SWAP_EVENT } from "./utils/constants";
import { getPoolAddress } from "./utils/getPoolAddress";
import { createFinding } from "./utils/createFinding";



export const provideHandleTransaction =
  (provider: ethers.providers.JsonRpcProvider): HandleTransaction =>
  async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    // filter only for emitted swap events
    const swapEvents = txEvent.filterLog(SWAP_EVENT);

    // now the hard part is making sure they are uniswap swaps only

    // How do I make sure the swap calls are to Uniswap and not other protocols with the same function signature?

    for (const swap of swapEvents) {
      try {
        const computedAddress = await getPoolAddress(swap.address, provider);
   
        if (computedAddress.toLowerCase() != swap.address.toLocaleLowerCase()) {
          return findings;
        }
        findings.push(createFinding(swap.address));
        return findings;
      } catch (e) {
      }
    }

    return findings;
  };

export default {
  handleTransaction: provideHandleTransaction(
    new ethers.providers.JsonRpcProvider(getJsonRpcUrl())
  ),
};
