
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wand2, ArrowRight, Mic } from 'lucide-react';
import GlassmorphismCard from '@/components/ui-custom/GlassmorphismCard';

const Index = () => {
  const navigate = useNavigate();

  // Automatically redirect to dashboard after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl px-4"
      >
        <div className="inline-flex bg-primary rounded-xl p-3 mb-6">
          <Wand2 className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Masterplan
        </motion.h1>
        
        <motion.p 
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          AI-Powered Teaching Assistant
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="gap-2"
            onClick={() => navigate('/dashboard')}
          >
            Enter Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="gap-2 glass border-0"
          >
            <Mic className="h-4 w-4" />
            Try Voice Assistant
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <GlassmorphismCard className="p-6 text-center">
            <div className="mb-2 text-lg font-medium">Automate Tasks</div>
            <p className="text-sm text-muted-foreground">
              Reduce administrative workload with smart automation
            </p>
          </GlassmorphismCard>
          
          <GlassmorphismCard className="p-6 text-center">
            <div className="mb-2 text-lg font-medium">Voice Enabled</div>
            <p className="text-sm text-muted-foreground">
              Control with natural language voice commands
            </p>
          </GlassmorphismCard>
          
          <GlassmorphismCard className="p-6 text-center">
            <div className="mb-2 text-lg font-medium">Data Insights</div>
            <p className="text-sm text-muted-foreground">
              Gain valuable insights from student performance
            </p>
          </GlassmorphismCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
