
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassmorphismCard from '@/components/ui-custom/GlassmorphismCard';
import { Bot, SendIcon, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface ContextAIProps {
  placeholder?: string;
}

const ContextAI: React.FC<ContextAIProps> = ({ placeholder = "Ask about your data..." }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !user) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Parse the user query to determine what data we need
      const query = input.toLowerCase();
      
      // Basic implementation that simply fetches data based on keywords
      let data = null;
      let responseText = '';
      
      if (query.includes('student') || query.includes('students')) {
        const { data: students, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        data = students;
        
        if (query.includes('attendance') && query.includes('below')) {
          const threshold = parseThreshold(query) || 75;
          const lowAttendance = students.filter(s => s.attendance < threshold);
          responseText = `I found ${lowAttendance.length} students with attendance below ${threshold}%: ${lowAttendance.map(s => s.name).join(', ')}`;
        } else if (query.includes('excellent')) {
          const excellentStudents = students.filter(s => s.performance === 'Excellent');
          responseText = `There are ${excellentStudents.length} students with excellent performance: ${excellentStudents.map(s => s.name).join(', ')}`;
        } else if (query.includes('at risk')) {
          const atRiskStudents = students.filter(s => s.performance === 'At Risk');
          responseText = `There are ${atRiskStudents.length} students at risk: ${atRiskStudents.map(s => s.name).join(', ')}`;
        } else {
          responseText = `I found ${students.length} students in your database. How would you like to analyze this data?`;
        }
      } else if (query.includes('assignment') || query.includes('assignments')) {
        const { data: assignments, error } = await supabase
          .from('assignments')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        data = assignments;
        
        if (query.includes('due') && query.includes('soon')) {
          // Simple implementation - in a real app we'd do proper date comparisons
          const upcomingAssignments = assignments.filter(a => a.status === 'Active');
          responseText = `You have ${upcomingAssignments.length} active assignments: ${upcomingAssignments.map(a => a.title).join(', ')}`;
        } else if (query.includes('low') && query.includes('submission')) {
          const lowSubmission = assignments.filter(a => a.submission_rate < 50 && a.status === 'Active');
          responseText = `There are ${lowSubmission.length} assignments with submission rates below 50%: ${lowSubmission.map(a => a.title).join(', ')}`;
        } else {
          responseText = `I found ${assignments.length} assignments in your database. What specific information are you looking for?`;
        }
      } else if (query.includes('lesson') || query.includes('lessons')) {
        const { data: lessons, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        data = lessons;
        
        if (query.includes('behind')) {
          const behindLessons = lessons.filter(l => l.status.includes('behind'));
          responseText = `There are ${behindLessons.length} lessons that are behind schedule: ${behindLessons.map(l => l.title).join(', ')}`;
        } else if (query.includes('progress')) {
          const avgProgress = lessons.reduce((acc, curr) => acc + curr.progress, 0) / lessons.length;
          responseText = `The average progress across all lessons is ${avgProgress.toFixed(1)}%`;
        } else {
          responseText = `I found ${lessons.length} lessons in your database. What would you like to know about them?`;
        }
      } else if (query.includes('course') || query.includes('courses')) {
        // Get unique courses from students table
        const { data: students, error } = await supabase
          .from('students')
          .select('course_id')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        const uniqueCourses = [...new Set(students.map(s => s.course_id))];
        responseText = `You are teaching ${uniqueCourses.length} courses: ${uniqueCourses.join(', ')}`;
      } else {
        responseText = "I can help you analyze your student data, assignments, and lessons. Try asking something like 'Show students below 75% attendance' or 'Which lessons are behind schedule?'";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: 'assistant'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: 'Error processing your request',
        description: 'There was a problem analyzing your data.',
        variant: 'destructive'
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        role: 'assistant'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to extract a threshold percentage from a query
  const parseThreshold = (query: string): number | null => {
    const matches = query.match(/below\s+(\d+)/i) || query.match(/under\s+(\d+)/i);
    if (matches && matches[1]) {
      return parseInt(matches[1], 10);
    }
    return null;
  };

  return (
    <GlassmorphismCard className="overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border/40 flex items-center gap-2">
        <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-medium">Data Analysis Assistant</h3>
          <p className="text-xs text-muted-foreground">Get insights from your educational data</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Ask questions about your student data, assignments, or lessons.</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge variant="outline" className="cursor-pointer" onClick={() => setInput("Show students below 75% attendance")}>
                Students below 75% attendance
              </Badge>
              <Badge variant="outline" className="cursor-pointer" onClick={() => setInput("Which lessons are behind schedule?")}>
                Lessons behind schedule
              </Badge>
              <Badge variant="outline" className="cursor-pointer" onClick={() => setInput("Show assignments with low submission rates")}>
                Low submission assignments
              </Badge>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-xl ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/70 backdrop-blur-sm text-secondary-foreground'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-2 rounded-xl bg-secondary/70 backdrop-blur-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border/40">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="pr-10 glass border-0"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full" 
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </GlassmorphismCard>
  );
};

export default ContextAI;
