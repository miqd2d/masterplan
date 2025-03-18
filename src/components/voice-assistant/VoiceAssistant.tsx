
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, SendIcon, Wand2 } from 'lucide-react';
import VoicePushButton from './VoicePushButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassmorphismCard from '../ui-custom/GlassmorphismCard';
import AnimatedChip from '../ui-custom/AnimatedChip';

interface VoiceAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Mock suggestions for the assistant
const SUGGESTIONS = [
  "Show students below 75% attendance",
  "Email reminders to students missing assignments",
  "Generate quiz questions for next class",
  "Summarize today's student feedback",
  "Tell me which lessons I'm behind on"
];

const VoiceAssistant = ({ onClose }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello, I'm your teaching assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleStartListening = () => {
    setIsListening(true);
    // In a real app, this would connect to the Web Speech API
    setTranscript('');
  };

  const handleStopListening = () => {
    setIsListening(false);
    // In a real app, this would stop the speech recognition
    // Simulate a transcript
    const mockTranscripts = [
      "Show me students below 75% attendance",
      "Create a Google Sheet of defaulters for Term 2",
      "Email reminders to students missing assignments"
    ];
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    setTranscript(randomTranscript);
    
    if (randomTranscript) {
      handleSendMessage(randomTranscript);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setTranscript('');
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      const responses = [
        "I've found 12 students below 75% attendance. Would you like me to show the list or send you a report?",
        "I've created a Google Sheet with the defaulters for Term 2 and shared it with you. You can access it from your Drive.",
        "I've sent reminder emails to 5 students who have missing assignments. Would you like me to notify you when they respond?",
        "Based on the current progress, you're behind on 3 lessons in the Advanced Data Structures course. Would you like me to suggest a revised schedule?"
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Blur the background when assistant is open
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('blur-sm', 'transition-all', 'duration-300');
    }
    
    return () => {
      if (main) {
        main.classList.remove('blur-sm', 'transition-all', 'duration-300');
      }
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg max-h-[85vh] mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <GlassmorphismCard intensity="strong" className="overflow-hidden flex flex-col h-[70vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
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
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              
              {transcript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-4 py-2 rounded-xl bg-secondary/30 text-muted-foreground animate-pulse">
                    <p>{transcript}...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border/40 space-y-4">
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion, index) => (
                  <AnimatedChip 
                    key={index} 
                    color="primary" 
                    className="cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </AnimatedChip>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <VoicePushButton 
                  onStart={handleStartListening} 
                  onStop={handleStopListening} 
                  isListening={isListening} 
                />
                <form onSubmit={handleInputSubmit} className="flex-1">
                  <div className="relative">
                    <Input
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Type your message..."
                      className="pr-10 glass border-0"
                    />
                    <Button 
                      type="submit" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-0 h-full" 
                      disabled={!inputValue.trim()}
                    >
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceAssistant;
