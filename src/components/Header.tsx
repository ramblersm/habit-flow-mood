
import React from 'react';
import { LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const Header = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return 'there';
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border-b border-blue-100">
      <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Home className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HabitHaven
              </h1>
              <p className="text-xs text-blue-500 font-medium">Your daily sanctuary</p>
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome, {getFirstName()}!
            </h2>
            <p className="text-sm text-gray-600">Build your perfect day</p>
          </div>
        </div>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default Header;
