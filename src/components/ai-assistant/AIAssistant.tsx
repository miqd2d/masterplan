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
      
      // Call the AI function with the user message and database context
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { 
          message: messageText,
          context: {
            students: dbContext?.students || [],
            assignments: dbContext?.assignments || [],
            lessons: dbContext?.lessons || []
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 no-blur modal-container">
      <motion.div 
        className="relative w-full h-[90vh] max-w-4xl mx-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden flex flex-col h-full rounded-xl bg-white shadow-lg border border-border/30">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
                <Wand2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="font-semibold">AI Assistant</h2>
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
                        : 'bg-secondary/70 text-secondary-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-xl bg-secondary/70">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
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
                  className="pr-10 border h-10"
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
    </div>
  );
};

export default AIAssistant;
