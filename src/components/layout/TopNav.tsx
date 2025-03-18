
import React from "react";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useSidebar } from "@/hooks/use-mobile";

interface TopNavProps {
  children?: React.ReactNode;
}

export default function TopNav({ children }: TopNavProps) {
  const { setIsSidebarOpen } = useSidebar();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="mr-4 md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <Link to="/" className="flex items-center gap-2">
          <span className="hidden font-bold sm:inline-block">
            EduTrack
          </span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}
