import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  ethers,
} from "forta-agent";

export const NETHERMIND_FORTA_ADDRESS: string =
  "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";

export const UPDATE_AGENT_FUNCTION: string =
  "function updateAgent(uint256 agentId,string metadata,uint256[] chainIds)";
export const CREATE_AGENT_FUNCTION: string =
  "function createAgent(uint256 agentId,address owner,string metadata,uint256[] chainIds)";

export const FORTA_CONTRACT_ADDRESS: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";

export const provideHandleTransaction =
  (): HandleTransaction =>
  async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    if (NETHERMIND_FORTA_ADDRESS.toLowerCase() !== txEvent.from.toLowerCase()) {
      return findings;
    }

    // filter the transaction logs for Bot Update Function call
    const nethermindBotUpdatesCalls = txEvent.filterFunction(
      UPDATE_AGENT_FUNCTION
    );

    // filter the transaction logs for Bot Create Function call
    const nethermindCreateBotCalls = txEvent.filterFunction(
      CREATE_AGENT_FUNCTION
    );

    nethermindBotUpdatesCalls.forEach((botUpdateFunction) => {
      const agentId = ethers.BigNumber.from(
        botUpdateFunction.args.agentId
      ).toString();

      findings.push(
        Finding.fromObject({
          name: "Nethermind Bot Update",
          description: `Nethermind botId: ${agentId} was updated.`,
          alertId: "FORTA-BOT-UPDATE",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            agentId: agentId,
          },
        })
      );
    });

    nethermindCreateBotCalls.forEach((createBotFunction) => {
      const agentId = ethers.BigNumber.from(
        createBotFunction.args.agentId
      ).toString();
      const owner = createBotFunction.args.owner;

      findings.push(
        Finding.fromObject({
          name: "Nethermind Bot Creation",
          description: `Nethermind botId: ${agentId} was created by owner ${owner}`,
          alertId: "FORTA-BOT-CREATE",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            agentId: agentId,
            owner: owner,
          },
        })
      );
    });

    return findings;
  };

export default {
  handleTransaction: provideHandleTransaction(),
};
