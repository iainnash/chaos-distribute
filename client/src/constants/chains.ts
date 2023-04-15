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
    color: 'bg-teal-400'
  },
  'polygon mumbai': {
    color: 'bg-pink-400'
  },
  'mantle testnet': {
    color: 'bg-cyan-200'
  },
  'gnosis': {
    color: 'bg-lime-400'
  }
}