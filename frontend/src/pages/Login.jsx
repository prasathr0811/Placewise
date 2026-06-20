import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('student@example.com');
    setPassword('student123');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] relative overflow-hidden flex items-center justify-center px-6">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-gray-900 dark:text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              PlaceWise
            </span>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to access your placement analytics dashboard</p>
        </div>

        {/* Login Form Box */}
        <div className="glass p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800/80">
            <button
              onClick={handleDemoLogin}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Autofill Demo Credentials
            </button>
          </div>
        </div>

        {/* Register Redirect */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-700 dark:text-indigo-300 font-semibold transition-all">
            Sign Up Free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
