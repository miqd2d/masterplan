
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isSignUp) {
        await signUp(email, password, fullName);
        toast({
          title: "Account created",
          description: "Please sign in with your credentials.",
        });
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      await signIn('test@example.com', 'test@123');
      navigate('/dashboard');
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="bg-primary rounded-md w-10 h-10 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">M</span>
                </div>
              </div>
            </Link>
            <h1 className="text-3xl font-bold">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp 
                ? 'Sign up to start managing your classroom effectively' 
                : 'Sign in to continue where you left off'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Try with Demo Account
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={toggleMode}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-lg space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Masterplan</h2>
            <p className="text-lg">
              The comprehensive platform for educators to manage students, assignments, lessons, and track academic progress all in one place.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
                <h3 className="font-semibold mb-2">Student Management</h3>
                <p className="text-sm">Track attendance, marks, and performance for all your students.</p>
              </div>
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
                <h3 className="font-semibold mb-2">Assignment Tracking</h3>
                <p className="text-sm">Create, distribute, and grade assignments efficiently.</p>
              </div>
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
                <h3 className="font-semibold mb-2">Lesson Planning</h3>
                <p className="text-sm">Plan and organize engaging lessons with built-in scheduling.</p>
              </div>
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-4">
                <h3 className="font-semibold mb-2">AI Assistant</h3>
                <p className="text-sm">Get insights and recommendations based on your teaching data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
