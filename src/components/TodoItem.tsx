import { motion } from 'framer-motion';
import { Check, Trash2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, disabled }: TodoItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'glass-card p-4 flex items-center gap-4 group',
        todo.completed && 'opacity-60',
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      <button
        onClick={() => onToggle(todo.id)}
        disabled={disabled}
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
          todo.completed
            ? 'bg-success border-success glow-success'
            : 'border-muted-foreground/50 hover:border-primary hover:glow-primary'
        )}
      >
        {todo.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className="w-3.5 h-3.5 text-success-foreground" />
          </motion.div>
        )}
      </button>

      <span
        className={cn(
          'flex-1 font-body text-foreground transition-all duration-200',
          todo.completed && 'line-through text-muted-foreground'
        )}
      >
        {todo.text}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        disabled={disabled}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
}
