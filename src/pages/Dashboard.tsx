
import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const { toast } = useToast();
  
  const showApiKeyReminder = () => {
    toast({
      title: "OpenAI API Key Required",
      description: "Set OPENAI_API_KEY in your Supabase project secrets for the AI assistant to work.",
      variant: "destructive",
      duration: 10000,
    });
  };
  
  React.useEffect(() => {
    // Show the API key reminder once when the dashboard loads
    showApiKeyReminder();
  }, []);
  
  return (
    <>
      <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <p className="text-sm text-yellow-700">Please set the OPENAI_API_KEY in your Supabase project secrets for the AI assistant to work fully.</p>
        <Button variant="outline" size="sm" className="ml-auto" onClick={showApiKeyReminder}>
          Learn More
        </Button>
      </div>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
