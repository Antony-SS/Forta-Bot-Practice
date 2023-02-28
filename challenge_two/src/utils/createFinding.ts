import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const createFinding = (poolAddress: string) => {
  return Finding.fromObject({
    name: "Uniswap Event Detected",
    description: `Swap event detected for pool with address: ${poolAddress}`,
    alertId: "UNISWAP-SWAP",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    metadata: {
      poolAddress: poolAddress,
    },
  });
};
