// Contract ABI for OnchainTodo
export const ONCHAIN_TODO_ABI = [
  {
    type: 'function',
    name: 'createTodo',
    inputs: [{ name: '_text', type: 'string', internalType: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'toggleTodo',
    inputs: [{ name: '_id', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deleteTodo',
    inputs: [{ name: '_id', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getTodos',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct OnchainTodo.Todo[]',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'text', type: 'string', internalType: 'string' },
          { name: 'completed', type: 'bool', internalType: 'bool' },
          { name: 'createdAt', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTodoCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'TodoCreated',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'id', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'text', type: 'string', indexed: false, internalType: 'string' },
      { name: 'createdAt', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TodoToggled',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'id', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'completed', type: 'bool', indexed: false, internalType: 'bool' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TodoDeleted',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'id', type: 'uint256', indexed: true, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const;

// Contract addresses by chain ID
// Replace with your deployed contract addresses
export const ONCHAIN_TODO_ADDRESSES: Record<number, `0x${string}`> = {
  8453: '0x0000000000000000000000000000000000000000', // Base Mainnet - deploy and replace
  84532: '0x0000000000000000000000000000000000000000', // Base Sepolia - deploy and replace
};

// Helper to get contract address for current chain
export function getContractAddress(chainId: number | undefined): `0x${string}` | undefined {
  if (!chainId) return undefined;
  return ONCHAIN_TODO_ADDRESSES[chainId];
}
