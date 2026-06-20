import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  Briefcase, 
  Activity, 
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      title: "Campus Placement Predictor",
      desc: "XGBoost classifier estimates your placement probability using academic history, projects, and aptitude scores.",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Salary CTC Estimator",
      desc: "Regression analysis predicts your salary range in LPA based on your branch, certification counts, and core skill count.",
      icon: Activity,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Explainable AI (SHAP)",
      desc: "Get deep transparency. See exactly which factors (CGPA, backlogs, specific skills) push your predictions up or down.",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Skill Gap radar Chart",
      desc: "Select target roles like Backend Engineer or Data Scientist. Compare your skills and visualize gaps on an interactive Radar chart.",
      icon: Award,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "AI Career Recommendations",
      desc: "Uses profile cosine similarity algorithms to recommend top roles, including growth rates and required skills.",
      icon: Briefcase,
      color: "from-rose-500 to-orange-500"
    },
    {
      title: "Student PDF reports",
      desc: "Download an analytical ReportLab PDF report containing placement predictions, SHAP details, and career matches.",
      icon: ShieldCheck,
      color: "from-orange-500 to-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] relative overflow-hidden flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            PlaceWise
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/20 flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white font-medium transition-all">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 z-10 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400 text-sm mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>AI-Driven Placement & Skill Gap Analytics</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Predict & Plan Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Campus Placement
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            PlaceWise leverages advanced Machine Learning (XGBoost & SHAP) to estimate your placement probabilities, predict starting salary packages, identify critical skill gaps, and provide actionable career pathways.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300 shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-3 hover:scale-[1.02]"
            >
              <span>{user ? "View My Dashboard" : "Create Free Account"}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            {!user && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                Explore Demo Login
              </Link>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            Supercharged Analytics Suite
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="glass p-8 rounded-2xl glass-hover">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center shadow-lg mb-6`}>
                    <Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-500 border-t border-gray-900 max-w-7xl mx-auto w-full z-10">
        <p>&copy; {new Date().getFullYear()} PlaceWise Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
