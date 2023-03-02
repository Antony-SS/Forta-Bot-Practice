import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  ethers, getEthersProvider
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

    for (const swap of swapEvents) {
      try {
        const { computedAddress, poolData } = await getPoolAddress(swap.address, provider);
   
        if (computedAddress.toLowerCase() != swap.address.toLocaleLowerCase()) {
          return findings;
        } else {
          let metadata = {
            token0: poolData.token0.address,
            token1: poolData.token1.address,
            amount0: swap.args.at(2),
            amount1: swap.args.at(3)
          }
          findings.push(createFinding(swap.address, metadata));
        }
      } catch (e) {

      }
    }
    return findings;
  };

export default {
  handleTransaction: provideHandleTransaction(
    (getEthersProvider())
  ),
};
