import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TodoItem, type Todo } from './TodoItem';

export function TodoList() {
  const { isConnected } = useAccount();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const todo: Todo = { id: `${Date.now()}`, text: newTodo.trim(), completed: false, createdAt: Date.now() };
    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
    setIsAdding(false);
  };

  const handleToggle = (id: string) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const handleDelete = (id: string) => setTodos(prev => prev.filter(t => t.id !== id));

  if (!isConnected) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-pulse-glow">
          <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold mb-3 text-foreground">Connect Your Wallet</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Connect your wallet to start managing your onchain todos on Base. Your tasks are stored permanently on the blockchain.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <form onSubmit={handleAddTodo} className="flex gap-3">
        <Input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="What needs to be done?" className="flex-1 h-12 bg-card/60 backdrop-blur-xl border-border/50" disabled={isAdding} />
        <Button type="submit" variant="gradient" size="lg" disabled={!newTodo.trim() || isAdding}>
          {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        </Button>
      </form>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {todos.length === 0 ? <motion.div className="text-center py-12 text-muted-foreground"><p>No todos yet. Add your first onchain task!</p></motion.div> : todos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />)}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
