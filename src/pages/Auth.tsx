
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Home } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const Auth = () => {
  const [stage, setStage] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const { toast } = useToast();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await sendOtp(email);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Sent!",
        description: "Check your email for the one-time password.",
      });
      setStage('otp');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      setLoading(true);
      const { error } = await verifyOtp(email, value);
      if (error) {
        toast({
          title: "Invalid OTP",
          description: "The OTP is incorrect or has expired. Please try again.",
          variant: "destructive",
        });
        setOtp('');
      } else {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        // Navigation is handled by ProtectedRoute
      }
      setLoading(false);
    }
  };

  const changeEmail = () => {
    setEmail('');
    setOtp('');
    setStage('email');
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
            Welcome to your Haven
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in or create an account with a secure one-time password.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20">
          {stage === 'email' ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <h3 className="font-semibold text-lg text-center text-gray-800">Enter your email to continue</h3>
              <div>
                <Label htmlFor="email" className="sr-only">Email address</Label>
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
                  disabled={loading}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-800">Enter your OTP</h3>
                <p className="text-sm text-gray-600 mt-1">An OTP has been sent to <strong>{email}</strong>.</p>
                <button onClick={changeEmail} className="text-sm text-blue-600 hover:underline" disabled={loading}>Change email</button>
              </div>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={handleVerifyOtp}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {loading && otp.length === 6 && <p className="text-center text-sm text-gray-500">Verifying...</p>}
              <div className="text-center text-sm">
                <p className="text-gray-600">Didn't receive the code?</p>
                <button
                  onClick={(e) => handleSendOtp(e as any)}
                  disabled={loading}
                  className="font-medium text-blue-600 hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
