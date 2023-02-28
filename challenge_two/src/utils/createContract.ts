import { Contract, Provider } from "ethers";

import { V3_FACTORY_ADDRESS, IUNISWAPV3FACTORY } from "./constants";

export const getFactoryContract = (provider: Provider): Contract => {
  return new Contract(V3_FACTORY_ADDRESS, IUNISWAPV3FACTORY, provider);
};
