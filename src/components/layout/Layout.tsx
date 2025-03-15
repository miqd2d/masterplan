
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  MicIcon
} from 'lucide-react';
import VoiceAssistant from '../voice-assistant/VoiceAssistant';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Students", path: "/students" },
  { icon: BookOpen, label: "Lessons", path: "/lessons" },
  { icon: ClipboardCheck, label: "Assignments", path: "/assignments" },
];

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  const toggleVoiceAssistant = () => {
    setIsVoiceAssistantOpen(!isVoiceAssistantOpen);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-secondary/30">
        <Sidebar className="border-r border-border/40">
          <div className="flex h-16 items-center px-4 border-b border-border/40">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
                <span className="text-primary-foreground font-bold">M</span>
              </div>
              <span className="font-semibold">Masterplan</span>
            </Link>
          </div>
          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <nav className="space-y-1.5">
                  {navItems.map((item) => (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-2 ${
                          location.pathname === item.path
                            ? "bg-secondary/60"
                            : "hover:bg-secondary/40"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-border/40">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">Dr. Claire Peterson</span>
                <span className="text-xs text-muted-foreground truncate">Computer Science</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto text-muted-foreground">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="h-16 border-b border-border/40 flex items-center justify-between px-6">
            <div className="flex items-center">
              <SidebarTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-4 md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              <h1 className="text-xl font-semibold">{
                navItems.find(item => item.path === location.pathname)?.label || "Masterplan"
              }</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="glass glass-hover border-0" 
                size="icon"
                onClick={toggleVoiceAssistant}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="glass glass-hover border-0" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </main>
          
          {isVoiceAssistantOpen && (
            <VoiceAssistant onClose={toggleVoiceAssistant} />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
