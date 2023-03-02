import { Finding, FindingSeverity, FindingType } from "forta-agent";
import { poolData } from "./getPoolAddress";

export const createFinding = (poolAddress: string, metadata: any) => {
  return Finding.fromObject({
    name: "Uniswap Event Detected",
    description: `Swap event detected for pool with address: ${poolAddress}`,
    alertId: "UNISWAP-SWAP",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    metadata: {
      poolAddress: poolAddress,
      protocol: "Uniswap-v3",
      token0: metadata['token0'],
      token1: metadata['token1'],
      amount0: metadata['amount0'],
      amount1: metadata['amount1']
    },
  });
};
