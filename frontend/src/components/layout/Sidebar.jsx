import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Award, 
  Briefcase, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Predict Placement', path: '/predict', icon: TrendingUp },
    { name: 'Skill Gap Analysis', path: '/skill-gap', icon: Award },
    { name: 'Career Matcher', path: '/careers', icon: Briefcase },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen glass border-r border-gray-200 dark:border-gray-800 flex flex-col z-20">
      {/* Brand Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-gray-900 dark:text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          PlaceWise
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-50 dark:from-indigo-600/20 to-purple-50 dark:to-purple-600/10 border-l-4 border-indigo-500 text-indigo-600 dark:text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-gray-800/40 border-l-4 border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Status and Logout */}
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/20">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="truncate">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-xl transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
