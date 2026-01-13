import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TodoItem, type Todo } from './TodoItem';
import { useTodoContract } from '@/hooks/useTodoContract';
import { toast } from 'sonner';

export function TodoList() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const {
    todos: onchainTodos,
    isLoadingTodos,
    isWritePending,
    isConfirming,
    isConfirmed,
    txHash,
    error,
    isContractDeployed,
    createTodo,
    toggleTodo,
    deleteTodo,
    refetchTodos,
  } = useTodoContract();

  const [newTodo, setNewTodo] = useState('');
  const [pendingAction, setPendingAction] = useState<'add' | 'toggle' | 'delete' | null>(null);

  // Convert onchain todos to frontend format
  const todos: Todo[] = onchainTodos.map((t) => ({
    id: t.id.toString(),
    text: t.text,
    completed: t.completed,
    createdAt: Number(t.createdAt) * 1000,
  }));

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && txHash) {
      toast.success('Transaction confirmed!', {
        description: 'Your todo has been saved onchain.',
        action: {
          label: 'View',
          onClick: () => window.open(`https://basescan.org/tx/${txHash}`, '_blank'),
        },
      });
      refetchTodos();
      setPendingAction(null);
    }
  }, [isConfirmed, txHash, refetchTodos]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error('Transaction failed', {
        description: (error as Error).message?.slice(0, 100) || 'Something went wrong',
      });
      setPendingAction(null);
    }
  }, [error]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    if (!isContractDeployed) {
      toast.error('Contract not deployed', {
        description: 'Please deploy the contract first or switch to a supported network.',
      });
      return;
    }

    try {
      setPendingAction('add');
      createTodo(newTodo.trim());
      setNewTodo('');
    } catch (err) {
      console.error('Failed to create todo:', err);
      setPendingAction(null);
    }
  };

  const handleToggle = (id: string) => {
    try {
      setPendingAction('toggle');
      toggleTodo(BigInt(id));
    } catch (err) {
      console.error('Failed to toggle todo:', err);
      setPendingAction(null);
    }
  };

  const handleDelete = (id: string) => {
    try {
      setPendingAction('delete');
      deleteTodo(BigInt(id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setPendingAction(null);
    }
  };

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center py-20"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-pulse-glow">
          <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold mb-3 text-foreground">Connect Your Wallet</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Connect your wallet to start managing your onchain todos on Base. Your tasks are stored permanently on the blockchain.
        </p>
      </motion.div>
    );
  }

  // Show contract deployment notice
  if (!isContractDeployed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Contract Not Deployed</h3>
              <p className="text-muted-foreground mb-4">
                The OnchainTodo smart contract hasn't been deployed to {chainId === 8453 ? 'Base Mainnet' : 'Base Sepolia'} yet.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>To deploy the contract:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Copy the Solidity contract from <code className="text-primary">src/contracts/TodoContract.sol</code></li>
                  <li>Deploy using Remix, Hardhat, or Foundry to Base</li>
                  <li>Update the contract address in <code className="text-primary">src/contracts/config.ts</code></li>
                </ol>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://remix.ethereum.org', '_blank')}
                >
                  Open Remix <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://bridge.base.org', '_blank')}
                >
                  Bridge to Base <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo mode with local state */}
        <DemoTodoList />
      </motion.div>
    );
  }

  const isLoading = isWritePending || isConfirming;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Transaction status */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3"
        >
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-primary">
            {isWritePending ? 'Confirm in your wallet...' : 'Waiting for confirmation...'}
          </span>
          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
            >
              View tx <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </motion.div>
      )}

      <form onSubmit={handleAddTodo} className="flex gap-3">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 h-12 bg-card/60 backdrop-blur-xl border-border/50"
          disabled={isLoading}
        />
        <Button type="submit" variant="gradient" size="lg" disabled={!newTodo.trim() || isLoading}>
          {isLoading && pendingAction === 'add' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        </Button>
      </form>

      <div className="space-y-3">
        {isLoadingTodos ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your onchain todos...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {todos.length === 0 ? (
              <motion.div className="text-center py-12 text-muted-foreground">
                <p>No todos yet. Add your first onchain task!</p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  disabled={isLoading}
                />
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// Demo component for when contract isn't deployed
function DemoTodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: `${Date.now()}`,
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [todo, ...prev]);
    setNewTodo('');
    toast.info('Demo mode', { description: 'Deploy the contract to save todos onchain!' });
  };

  const handleToggle = (id: string) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const handleDelete = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="px-2 py-1 rounded bg-muted text-xs font-medium">DEMO MODE</span>
        <span>Try the app locally while setting up the contract</span>
      </div>
      <form onSubmit={handleAddTodo} className="flex gap-3">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Try adding a demo todo..."
          className="flex-1 h-12 bg-card/60 backdrop-blur-xl border-border/50"
        />
        <Button type="submit" variant="gradient" size="lg" disabled={!newTodo.trim()}>
          <Plus className="w-5 h-5" />
        </Button>
      </form>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {todos.length === 0 ? (
            <motion.div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Demo todos appear here</p>
            </motion.div>
          ) : (
            todos.map((todo) => <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />)
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
