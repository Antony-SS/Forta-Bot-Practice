export const V3_FACTORY_ADDRESS: string =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";

export const SWAP_EVENT = [
  "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
];

export const V3POOLABI = [
  "function token0() public view returns (address)",
  "function token1() public view returns (address)",
  "function fee() public view returns (uint24)",
];
