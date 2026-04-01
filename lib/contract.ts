export const SPLIT_CONTRACT_ADDRESS = '0x76242c1bdeca746a5dd9430b06c23af3ffe520f2' as const

export const splitAbi = [
  {
    type: 'function',
    name: 'split',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'recipients',
        type: 'address[]',
      },
      {
        name: 'shares',
        type: 'uint256[]',
      },
    ],
    outputs: [],
  },
] as const

