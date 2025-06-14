
import React from 'react';
import { LogOut } from 'lucide-react';
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
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {getFirstName()}!
          </h1>
          <p className="text-sm text-gray-600">Track your daily habits and mood</p>
        </div>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default Header;
