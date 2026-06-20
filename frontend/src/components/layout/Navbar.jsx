import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Calendar, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Get dynamic page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Placement Insights';
      case '/predict':
        return 'Campus Placement Predictor';
      case '/skill-gap':
        return 'Skill Gap & Role Analysis';
      case '/careers':
        return 'AI Career Matcher';
      case '/profile':
        return 'My Academic Profile';
      default:
        return 'PlaceWise';
    }
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="h-20 w-[calc(100%-16rem)] fixed right-0 top-0 glass border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 z-10">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <span>{getPageTitle()}</span>
          {location.pathname === '/dashboard' && (
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          )}
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400">Campus Placement & Analytics Platform</p>
      </div>

      <div className="flex items-center space-x-6">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Date Display */}
        <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 px-3.5 py-1.5 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{getTodayDate()}</span>
        </div>

        {/* User Badge */}
        {user && (
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 pl-3 pr-4 py-1.5 rounded-full">
            <div className="w-7 h-7 bg-indigo-600/30 border border-indigo-500/40 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
