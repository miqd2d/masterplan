
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Mic, MicOff, SendIcon, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello, I'm your teaching assistant. How can I help you today? I have access to your database and can provide insights about your students, lessons, assignments, and more.",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = handleAudioStop;
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks to release the microphone
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const handleAudioStop = async () => {
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const base64Audio = base64data.split(',')[1];
        
        // Call Supabase Edge Function for transcription
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });
        
        if (error) {
          throw new Error(`Transcription error: ${error.message}`);
        }
        
        if (data && data.text) {
          setInputValue(data.text);
          
          toast({
            title: "Transcription complete",
            description: "Your speech has been converted to text",
          });
          
          // Automatically send the transcribed message
          handleSendMessage(undefined, data.text);
        } else {
          throw new Error('No transcription returned');
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Transcription Error",
        description: "Failed to convert speech to text. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const fetchDatabaseContext = async () => {
    if (!user) return null;

    try {
      // Fetch relevant data from the database to provide context for AI
      const [studentsResult, assignmentsResult, lessonsResult] = await Promise.all([
        supabase.from('students').select('*').eq('user_id', user.id),
        supabase.from('assignments').select('*').eq('user_id', user.id),
        supabase.from('lessons').select('*').eq('user_id', user.id)
      ]);

      return {
        students: studentsResult.data || [],
        assignments: assignmentsResult.data || [],
        lessons: lessonsResult.data || []
      };
    } catch (error) {
      console.error('Error fetching database context:', error);
      return null;
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, speechText?: string) => {
    if (e) e.preventDefault();
    
    const messageText = speechText || inputValue;
    if (!messageText.trim() || !user) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Fetch database context to provide to the AI
      const dbContext = await fetchDatabaseContext();
      
      if (!dbContext) {
        throw new Error('Failed to fetch database context');
      }
      
      // Call the AI function with the user message and database context
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { 
          message: messageText,
          context: {
            students: dbContext.students,
            assignments: dbContext.assignments,
            lessons: dbContext.lessons
          }
        }
      });
      
      if (error) {
        throw new Error(`AI error: ${error.message}`);
      }
      
      // Process AI response
      let aiResponse = "I'm sorry, I couldn't process your request at this time.";
      
      if (data && data.response) {
        aiResponse = data.response;
      } else if (dbContext) {
        // If AI function fails or is not yet implemented, provide a context-aware fallback response
        const studentsCount = dbContext.students.length;
        const lowAttendanceCount = dbContext.students.filter(s => s.attendance < 75).length;
        const lowMarksCount = dbContext.students.filter(s => (s.marks || 0) < 60).length;
        
        // Create context-aware fallback responses based on the query
        const query = messageText.toLowerCase();
        
        if (query.includes('attendance') || query.includes('absent')) {
          aiResponse = `I found that ${lowAttendanceCount} out of ${studentsCount} students have attendance below 75%. Would you like me to list these students or prepare a report?`;
        } else if (query.includes('marks') || query.includes('grade') || query.includes('performance')) {
          aiResponse = `There are ${lowMarksCount} students with marks below 60%. Would you like me to suggest some intervention strategies?`;
        } else if (query.includes('assignment') || query.includes('homework')) {
          aiResponse = `You currently have ${dbContext.assignments.length} assignments in the system. The most recent ones are ${dbContext.assignments.slice(0, 3).map(a => a.title).join(", ")}.`;
        } else if (query.includes('lesson') || query.includes('course') || query.includes('subject')) {
          aiResponse = `You're currently teaching ${dbContext.lessons.length} lessons. The main lessons are ${dbContext.lessons.slice(0, 5).map(l => l.title).join(", ")}.`;
        } else {
          aiResponse = `Based on your database, you have ${studentsCount} students, ${dbContext.assignments.length} assignments, and ${dbContext.lessons.length} lessons. How can I help you analyze this information?`;
        }
      }
      
      // Add AI response message
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
      }, 500);
      
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: 'Error processing your request',
        description: 'There was a problem analyzing your data.',
        variant: 'destructive'
      });
      setIsProcessing(false);
    }
  };

  // Cleanup microphone access when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Blur the background when assistant is open
  useEffect(() => {
    if (isOpen) {
      const main = document.querySelector('main');
      if (main) {
        main.classList.add('blur-sm', 'transition-all', 'duration-300');
      }
      
      return () => {
        if (main) {
          main.classList.remove('blur-sm', 'transition-all', 'duration-300');
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full h-[90vh] max-w-4xl mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-hidden flex flex-col h-full rounded-xl bg-white/90 backdrop-blur-md border border-white/20 shadow-glass">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
                  <Wand2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <h2 className="font-semibold">Masterplan AI Assistant</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-xl ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary/70 backdrop-blur-sm text-secondary-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] px-4 py-2 rounded-xl bg-secondary/70 backdrop-blur-sm">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-border/40">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  className="flex-shrink-0 h-10 w-10"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                >
                  {isRecording ? 
                    <MicOff className="h-5 w-5" /> : 
                    <Mic className="h-5 w-5" />
                  }
                </Button>
                
                <div className="relative flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your data..."
                    className="pr-10 glass border-0 h-10"
                    disabled={isProcessing || isRecording}
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full" 
                    disabled={!inputValue.trim() || isProcessing || isRecording}
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;
