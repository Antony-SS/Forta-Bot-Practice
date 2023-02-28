import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { HandleTransaction, ethers } from "forta-agent";
import { createFinding } from "./utils/createFinding";
import { SWAP_EVENT, TRANSFER_EVENT } from "./utils/constants";
import agent from "./agent";

const BigNumber = require("big-number");

const SWAP_TEST_1 = {
  TOKEN0_ADDR: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  TOKEN0_VAL: ethers.BigNumber.from("300"),
  TOKEN1_ADDR: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI Stable Coin
  TOKEN1_VAL: ethers.BigNumber.from("200"),
  POOL_ADDR: "0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168", // USDC / DAI Pool
  Fee: ethers.BigNumber.from("1000"),
};

// Test values for a valid uniswap event but from a diff pool from the firts test vals
// const SWAP_TEST_2 = {
//   TOKEN2_ADDR: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
//   TOKEN2_VAL:  ethers.BigNumber.from("300"),
//   TOKEN3_ADDR: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
//   TOKEN3_VAL: ethers.BigNumber.from("100"),
//   POOL_ADDR2: "0x4585FE77225b41b697C938B018E2Ac67Ac5a20c0", // WBTC/WETH Pool
//   Fee: ethers.BigNumber.from("1000"),
// };

const SWAP_TEST_2 = {
  TOKEN2_ADDR: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  TOKEN2_VAL: ethers.BigNumber.from("100"),
  TOKEN3_ADDR: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  TOKEN3_VAL: ethers.BigNumber.from("400"),
  POOL_ADDR2: "0x4585FE77225b41b697C938B018E2Ac67Ac5a20c0",
  Fee: ethers.BigNumber.from("500"),
};

// These are also test vals for the swap event but can remain the same so we use these for both cases
const SQRT_PRICE = ethers.BigNumber.from("10");
const LIQ = ethers.BigNumber.from("1000");
const TICK = ethers.BigNumber.from("1");

describe("Uniswap Swaps Agent", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  it("Should return empty findings if no events occur", async () => {
    const mockTxEvent = new TestTransactionEvent();
    const findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });

  it("Should return empty findings for non swap events ", async () => {
    const mockTxEvent = new TestTransactionEvent();
    mockTxEvent.addEventLog(TRANSFER_EVENT[0], createAddress("0x1"), [
      createAddress("0x2"),
      createAddress("0x1"),
      5,
    ]);
    const findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });

  it("Should return empty findings for swaps not in Uniswap pool", async () => {
    const mockTxEvent = new TestTransactionEvent();
    mockTxEvent.addEventLog(SWAP_EVENT[0], createAddress("0x5"), [
      SWAP_TEST_1.TOKEN0_ADDR,
      SWAP_TEST_1.TOKEN1_ADDR,
      SWAP_TEST_1.TOKEN0_VAL,
      SWAP_TEST_1.TOKEN1_VAL,
      SQRT_PRICE,
      LIQ,
      TICK,
    ]);

    mockTxEvent.setFrom(createAddress(createAddress("0x5")));
    const findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([]);
  });

  it("Should return a finding for a swap in Uniswap Pool", async () => {
    const mockTxEvent = new TestTransactionEvent();
    mockTxEvent.addEventLog(SWAP_EVENT[0], SWAP_TEST_1.POOL_ADDR, [
      SWAP_TEST_1.TOKEN0_ADDR,
      SWAP_TEST_1.TOKEN1_ADDR,
      SWAP_TEST_1.TOKEN0_VAL,
      SWAP_TEST_1.TOKEN1_VAL,
      SQRT_PRICE,
      LIQ,
      TICK,
    ]);

    const findings = await handleTransaction(mockTxEvent);
    const swapFinding = createFinding(
      SWAP_TEST_1.POOL_ADDR.toLocaleLowerCase()
    );

    expect(findings.length).toStrictEqual(1);
    expect(findings[0]).toStrictEqual(swapFinding);
  });

  // REVIEWER PLEASE HELP?
  // it("Should return 2 findings for 2 swaps in different Uniswap pools",
  //   async () => {
  //     const mockTxEvent = new TestTransactionEvent();
  //     mockTxEvent.

  //     addEventLog(SWAP_EVENT[0], SWAP_TEST_1.POOL_ADDR, [
  //       SWAP_TEST_1.TOKEN0_ADDR,
  //       SWAP_TEST_1.TOKEN1_ADDR,
  //       SWAP_TEST_1.TOKEN0_VAL,
  //       SWAP_TEST_1.TOKEN1_VAL,
  //       SQRT_PRICE,
  //       LIQ,
  //       TICK,
  //     ])
  //     .addEventLog(SWAP_EVENT[0], SWAP_TEST_2.POOL_ADDR2, [
  //       SWAP_TEST_2.TOKEN2_ADDR,
  //       SWAP_TEST_2.TOKEN3_ADDR,
  //       SWAP_TEST_2.TOKEN2_VAL,
  //       SWAP_TEST_2.TOKEN3_VAL,
  //       SQRT_PRICE,
  //       LIQ,
  //       TICK,
  //     ]);

  //     const findings = await handleTransaction(mockTxEvent);
  //     const swapFinding1 = createFinding(SWAP_TEST_1.POOL_ADDR.toLocaleLowerCase());
  //     const swapFinding2 = createFinding(SWAP_TEST_2.POOL_ADDR2.toLocaleLowerCase());

  //     console.log(findings);
  //     expect(findings.length).toEqual(2);

  //     expect(findings[0]).toStrictEqual(swapFinding1);
  //     expect(findings[1]).toStrictEqual(swapFinding2);
  //   });
});
