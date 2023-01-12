import {
  BlockEvent,
  Finding,
  Initialize,
  HandleBlock,
  HandleTransaction,
  HandleAlert,
  AlertEvent,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";


export const NETHERMIND_FORTA_ADDRESS = 0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8;


const initialize: Initialize = async () => {
  // do some initialization on startup e.g. fetch data
}

// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }

const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
  const findings: Finding[] = [];
  // detect some alert condition
  return findings;
}

export default {
   initialize,
  // handleBlock,
  handleAlert
};
