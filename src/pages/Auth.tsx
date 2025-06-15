import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { signUp, signIn, signInWithMagicLink } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMagicLinkSent(false);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Welcome to HabitHaven!",
            description: "Your account has been created. Please check your email to continue.",
          });
          setIsSignUp(false);
          setPassword('');
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          // Navigation is handled by ProtectedRoute
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSignIn = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to receive a magic link.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await signInWithMagicLink(email);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMagicLinkSent(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for a link to sign in.",
      });
    }
    setLoading(false);
  };

  const toggleFormType = () => {
    setIsSignUp(!isSignUp);
    setMagicLinkSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Home className="h-12 w-12 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HabitHaven
              </h1>
              <p className="text-sm text-blue-500 font-medium">Your daily sanctuary</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Join Your Haven' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp ? 'Create your personal sanctuary for growth' : 'Continue your journey of positive habits'}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20">
          {magicLinkSent ? (
            <div className="text-center p-4 bg-blue-100/50 rounded-lg">
              <h3 className="font-bold text-blue-800">Check your inbox!</h3>
              <p className="text-sm text-blue-700 mt-1">We've sent a magic link to <strong>{email}</strong>. Click the link to sign in.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                >
                  {loading ? 'Please wait...' : (isSignUp ? 'Create Haven' : 'Enter Haven')}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm space-y-4">
            {!isSignUp && !magicLinkSent && (
              <button
                type="button"
                onClick={handleMagicLinkSignIn}
                disabled={loading || !email}
                className="font-medium text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Email me a sign-in link
              </button>
            )}
            {!magicLinkSent && (
              <p className="text-gray-600">
                {isSignUp ? 'Already have a haven? ' : "Don't have a haven? "}
                <button
                  type="button"
                  onClick={toggleFormType}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
