# Uniswap Swap Detection Bot

## Description

This bot detects any swaps made on the Uniswap protocol across all pools

## Supported Chains

- Ethereum

## Alerts

- UNISWAP-SWAP
  - Fired when a transaction calls the swap function
  - Severity is always set to "Info"
  - Type is always set to "info"
  - Metadata:
    - pool: address of the liquidity pool of the two tokens
## Test Data

The bot behaviour can be verified with the following transactions:

- Transaction: 0xf8419ad140ed53bf0b02228ff3f6b73d34b99cd0b13a355b0bf62ec04a1c6c57
  https://etherscan.io/tx/0xf8419ad140ed53bf0b02228ff3f6b73d34b99cd0b13a355b0bf62ec04a1c6c57