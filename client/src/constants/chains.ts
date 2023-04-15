export const CHAINS = {
  '1': {
    actor: 'ether.actor',
    scan: 'etherscan.io',
  },
  '5': {
    actor: 'goerli.ether.actor',
    scan: 'goerli.etherscan.io',
  },
  '1337': {
    actor: 'mumbai.ether.actor',
    scan: 'mumbai.polygonscan.com',
  }
} as const;

export const CHAIN_FE = {
  'goerli': {
    color: 'bg-teal-400',
    currency: "GOETH",
    scan: 'goerli.etherscan.io',
  },
  'polygon mumbai': {
    currency: "MATIC",
    color: 'bg-pink-400',
    scan: 'mumbai.polygonscan.com',
  },
  'mantle testnet': {
    currency: "BIT",
    color: 'bg-cyan-200',
    scan: '',
  },
  'gnosis': {
    currency: "xDAI",
    color: 'bg-lime-400',
    scan: 'gnosisscan.io',
  },
  'taiko': {
    currency: 'ETH',
    color: 'bg-lime-500',
    scan: 'l2explorer.hackathon.taiko.xyz'
  }
}