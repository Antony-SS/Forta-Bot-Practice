# Nethermind Bot Deploy and Update Monitor

## Description

This bot detects when Nethermind deploys or updates a Forta Bot

## Supported Chains

- Polygon

## Alerts

- FORTA-BOT-UPDATE
  - Fired when a transaction comes from Nethermind's wallet address that contains the agentUpdate function call
  - Severity: Info
  - Type: Info
  - Metadata: Bot-ID number

- FORTA-BOT-CREATE
  - Fired when a transcation comes from Netherminds wallet address that contains the createAgent function call
  - Severity: Info
  - Type: Info
  - Metadata: Bot-ID number
  
## Test Data

The bot behaviour can be verified with the following transaction:

- [0x72482c5bddd5ee333e177caf8cd4056a8eee83b74cdcc4218b8fa707854e66f4](https://polygonscan.com/tx/0x72482c5bddd5ee333e177caf8cd4056a8eee83b74cdcc4218b8fa707854e66f4) (bot creation with id: 64235728982376409709439139978057092858568305508934039865220382119682812608133)

