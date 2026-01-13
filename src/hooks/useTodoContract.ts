import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId, useConfig } from 'wagmi';
import { ONCHAIN_TODO_ABI, getContractAddress } from '@/contracts/config';
import { base, baseSepolia } from 'wagmi/chains';

export interface OnchainTodo {
  id: bigint;
  text: string;
  completed: boolean;
  createdAt: bigint;
}

export function useTodoContract() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = getContractAddress(chainId);
  const config = useConfig();
  
  const chain = chainId === 8453 ? base : baseSepolia;

  const { writeContract, data: txHash, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const {
    data: todos,
    isLoading: isLoadingTodos,
    refetch: refetchTodos,
    error: readError,
  } = useReadContract({
    address: contractAddress,
    abi: ONCHAIN_TODO_ABI,
    functionName: 'getTodos',
    query: {
      enabled: isConnected && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  const createTodo = (text: string) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000' || !address) return;
    writeContract({ address: contractAddress, abi: ONCHAIN_TODO_ABI, functionName: 'createTodo', args: [text], account: address, chain });
  };

  const toggleTodo = (id: bigint) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000' || !address) return;
    writeContract({ address: contractAddress, abi: ONCHAIN_TODO_ABI, functionName: 'toggleTodo', args: [id], account: address, chain });
  };

  const deleteTodo = (id: bigint) => {
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000' || !address) return;
    writeContract({ address: contractAddress, abi: ONCHAIN_TODO_ABI, functionName: 'deleteTodo', args: [id], account: address, chain });
  };

  const isContractDeployed = contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000';

  return {
    todos: (todos as OnchainTodo[] | undefined) ?? [],
    isLoadingTodos,
    isWritePending,
    isConfirming,
    isConfirmed,
    txHash,
    error: writeError || readError,
    isContractDeployed,
    contractAddress,
    chainId,
    createTodo,
    toggleTodo,
    deleteTodo,
    refetchTodos,
  };
}
