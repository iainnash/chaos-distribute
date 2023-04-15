export const GRID_BASIS = 4;

export const CHAIN_INFO = {
  goerli: {
    id: 5,
    currency: "GOETH",
    amountMin: "0.01",
    amountMax: "0.04",
    rpc: "https://rpc.ankr.com/eth_goerli",
    safe: '0x11F254Fb7Bd4b7C36aAC38531E023833A753F393',
    nft: '0x21461A641ec9B68a048e0Ff303E7b22F148D62Da',
    safeTXN: 'https://safe-transaction-goerli.safe.global'
  },
  "polygon mumbai": {
    id: 80001,
    currency: "MATIC",
    amountMin: "0.01",
    amountMax: "0.04",
    nft: '0x37c89a8E5B6D2063e242C68e9e7eEE44c5A07Fc7',
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
    // safe: '0x66d20ca334Cef34D1695bF27AA3f9e785fF97e01',
  },
  taiko: {
    id: 167002,
    currency: '',
    amountMin: "0.0001",
    amountMax: "0.001",
    rpc: 'https://l2rpc.hackathon.taiko.xyz',

  }
};
