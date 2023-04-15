export const GRID_BASIS = 4;

export const CHAIN_INFO = {
  goerli: {
    id: 5,
    currency: "GOETH",
    nft: "",
    amountMin: "0.01",
    amountMax: "0.04",
    rpc: "https://rpc.ankr.com/eth_goerli",
    safe: '0x11F254Fb7Bd4b7C36aAC38531E023833A753F393',
    safeTXN: 'https://safe-transaction-goerli.safe.global'
  },
  "polygon mumbai": {
    id: 80001,
    currency: "MATIC",
    nft: "",
    amountMin: "0.01",
    amountMax: "0.04",
    rpc: "https://rpc.ankr.com/polygon_mumbai",
  },
  "mantle testnet": {
    id: 5001,
    currency: "BIT",
    amountMin: "0.01",
    amountMax: "0.04",
    rpc: "https://rpc.testnet.mantle.xyz",
    // https://explorer.testnet.mantle.xyz/address/0x8F71cF32a8f2db2aFa11C4B236134abe614739F5
  },
  // not a testnet
  gnosis: {
    id: 100,
    currency: "xDAI",
    amountMin: "0.00000001",
    amountMax: "0.0000001",
    safeTXN: 'https://safe-transaction-gnosis-chain.safe.global',
    rpc: "https://gnosischain-rpc.gateway.pokt.network",
    safe: '0x66d20ca334Cef34D1695bF27AA3f9e785fF97e01',
  },
};
