
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3 } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-4">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
            isActive('/') 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Home size={20} />
          <span className="text-xs font-medium">Dashboard</span>
        </Link>
        
        <Link
          to="/analytics"
          className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
            isActive('/analytics') 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <BarChart3 size={20} />
          <span className="text-xs font-medium">Analytics</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
