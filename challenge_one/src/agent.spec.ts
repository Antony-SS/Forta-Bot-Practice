import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  TransactionEvent,
} from "forta-agent";

import { TestTransactionEvent } from "forta-agent-tools/lib/test";

import agent, { NETHERMIND_FORTA_ADDRESS } from "./agent";

import { BigNumber } from "bignumber.js";

var Web3 = require("web3");
var web3 = new Web3(Web3.givenProvider);

const MOCK_AGENT_ID =
  "64235728982376409709439139978057092858568305508934039865220382119682812608133";

const updateBotFinding: Finding = Finding.fromObject({
  name: "Nethermind Bot Update",
  description: `Nethermind botId: ${MOCK_AGENT_ID} was updated.`,
  alertId: "FORTA-BOT-UPDATE",
  severity: FindingSeverity.Info,
  type: FindingType.Info,
  metadata: {
    agentId: MOCK_AGENT_ID,
  },
});

describe("Nethermind deployer address monitor teste suite", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  it("Should return empty findings if no transaction from Nethermind deployer address is found", async () => {
    const mockTxEvent: TransactionEvent = new TestTransactionEvent().setFrom(
      "0x0"
    );

    const findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([]);
  });

  it("Should return empty findings if no transaction from Nethermind deployer address is found", async () => {
    const mockTxEvent: TransactionEvent = new TestTransactionEvent().setFrom(
      "0x262Fb24645cf0Dd8D0f35f415eB75417BF639666"
    );

    const findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });

  it("Should return empty findings if transaction from deployer address does not contain function call to updateBot or createBot", async () => {
    const mockTxEvent: TransactionEvent = new TestTransactionEvent().setFrom(
      NETHERMIND_FORTA_ADDRESS
    );

    const findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });

  it("Should return BOT-UPDATED finding if transaction from nethermind address contains function call to updateBot", async () => {
    const mockChainIds = [new BigNumber(1)];

    const callData = web3.eth.abi.encodeFunctionCall(
      {
        name: "updateAgent",
        type: "function",
        inputs: [
          {
            type: "uint256",
            name: "agentId",
          },
          {
            type: "string",
            name: "metadata",
          },
          {
            type: "uint256[]",
            name: "chainIds",
          },
        ],
      },
      [
        "64235728982376409709439139978057092858568305508934039865220382119682812608133",
        "QmSJSRECkgCzRBeoASCgZ4XpxPmwNCUgfLQ41o27pYcZiK",
        mockChainIds,
      ]
    );

    const mockTxEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom("0x262Fb24645cf0Dd8D0f35f415eB75417BF639666")
      .setData(callData);
    const findings = await handleTransaction(mockTxEvent);
    expect(findings[0]).toStrictEqual(updateBotFinding);
  });
});
