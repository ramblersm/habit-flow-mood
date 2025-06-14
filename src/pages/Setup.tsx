
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Sparkles } from 'lucide-react';

const Setup = () => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Setup form submitted with:', { fullName, age, gender, userId: user?.id });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          age: parseInt(age),
          gender,
          setup_completed: true
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Profile updated successfully, navigating to home page');

      toast({
        title: "Welcome to HabitHaven!",
        description: "Your sanctuary is ready. Let's start building great habits!",
      });

      // Force navigation with replace to ensure clean transition
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to Your Haven
            </h2>
          </div>
          <p className="text-gray-600">
            Let's personalize your sanctuary for building amazing habits
          </p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-gray-700">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-md border border-blue-200 bg-white/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
              >
                {loading ? 'Setting up your haven...' : 'Enter My Haven'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;
