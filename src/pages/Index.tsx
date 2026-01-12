import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { TodoList } from '@/components/TodoList';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <main className="relative container mx-auto px-4 pt-28 pb-12 max-w-2xl">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-primary">Live on Base</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Your Tasks,{' '}
            <span className="gradient-text">Onchain</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            A decentralized todo list that lives forever on Base. 
            Own your productivity.
          </p>
        </motion.div>

        {/* Todo List */}
        <TodoList />

        {/* Footer hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>Built on Base • Powered by Ethereum</p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;