import { LRUCache } from "typescript-lru-cache";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { Contract } from "ethers";
import { ethers } from "forta-agent";
import { V3POOLIFACE, V3_FACTORY_ADDRESS } from "./constants";

export type poolData = {
  token0: Token;
  token1: Token;
  fee: FeeAmount;
};

export const getPoolAddress = async (
  poolAddress: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  let cache: LRUCache<string, poolData> = new LRUCache<string, poolData>({
    maxSize: 500,
    entryExpirationTimeInMS: 50000,
  });

  let poolData;
  if (cache.has(poolAddress)) {
    poolData = cache.get(poolAddress) as poolData;
  } else {
    const poolContract = new Contract(poolAddress, V3POOLIFACE, provider);
    let token0 = new Token(1, await poolContract.token0(), 18);
    let token1 = new Token(1, await poolContract.token1(), 18);
    let fee = await poolContract.fee();

    cache.set(poolAddress, { token0, token1, fee } as poolData);
    poolData = { token0, token1, fee } as poolData;
  }

  try {
    const computedAddress = computePoolAddress({
      factoryAddress: V3_FACTORY_ADDRESS,
      tokenA: poolData.token0,
      tokenB: poolData.token1,
      fee: poolData.fee,
    });
    return computedAddress;
  } catch (e) {
    throw e;
  }
};
