import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
const Index = () => {
  const {
    user
  } = useAuth();
  return <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">Welcome to masterplan</h1>
        <p className="mb-6 max-w-2xl text-lg text-muted-foreground">
          The comprehensive platform for managing educational resources, students, assignments, and lessons.
        </p>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          {user ? <Button asChild size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button> : <Button asChild size="lg">
              <Link to="/login">Get Started</Link>
            </Button>}
          
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
      
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Student Management</h3>
          <p className="text-muted-foreground">
            Track student performance, attendance, and engagement in one place.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Assignment Tracking</h3>
          <p className="text-muted-foreground">
            Create, distribute, and grade assignments with powerful analytics.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-2 text-xl font-semibold">Lesson Planning</h3>
          <p className="text-muted-foreground">
            Plan, organize, and deliver engaging lessons with built-in scheduling.
          </p>
        </div>
      </div>
    </div>;
};
export default Index;