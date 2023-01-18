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

// SCRATCH ORIGINAL APPRAOCH, MONITOR THE CONTRACT THAT FORTA BOTS ARE REGISTERED AT, LOOK FOR NETHERMIND DEPLOYER ID
// COULD ALSO JUST MONITOR NETHERMIND's WALLET ADDRESS... -> this seems easier

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  if (NETHERMIND_FORTA_ADDRESS === txEvent.from) {
    console.log(
      `Returning, could not find nethermind address in ${txEvent.addresses}`
    );
    return findings;
  }

  // filter the transaction logs for Tether transfer events
  const nethermindBotUpdatesCalls = txEvent.filterFunction(
    UPDATE_AGENT_FUNCTION
  );

  const nethermindCreateBotCalls = txEvent.filterFunction(
    CREATE_AGENT_FUNCTION
  );

  console.log(`Number of create calls: ${nethermindCreateBotCalls.length}`);

  nethermindBotUpdatesCalls.forEach((botUpdateFunction) => {
    const agentId = botUpdateFunction.args.agentId;

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
    const agentId = createBotFunction.args.agentId;
    const owner = createBotFunction.args.owner;

    findings.push(
      Finding.fromObject({
        name: "Nethermind Bot Creation",
        description: `Nethermind botId: ${agentId} was created by owner ${owner}`,
        alertId: "FORTA-BOT-UPDATE",
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
  handleTransaction,
};
