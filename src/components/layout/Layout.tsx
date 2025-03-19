
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import TopNav from './TopNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft, Wand2, LayoutDashboard, Users, BookOpen, CheckSquare } from 'lucide-react';
import AIAssistant from '../ai-assistant/AIAssistant';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Close sidebar on mobile by default
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleAIAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen);
  };

  // Navigation menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: BookOpen, label: 'Lessons', path: '/lessons' },
    { icon: CheckSquare, label: 'Assignments', path: '/assignments' },
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar className="z-30">
          <SidebarHeader>
            <div className="p-4 font-bold text-lg">Masterplan</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link to={item.path} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleSidebar}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
            
            <div className="ml-auto flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="flex items-center justify-center"
                onClick={toggleAIAssistant}
              >
                <Wand2 className="h-5 w-5" />
              </Button>
            </div>
          </TopNav>
          
          <main className="flex-1 overflow-y-auto px-4 pt-6 pb-12 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </main>
        </div>
        
        {aiAssistantOpen && <AIAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
