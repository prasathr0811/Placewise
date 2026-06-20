import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  TrendingUp,
  DollarSign,
  Activity,
  Briefcase,
  Sparkles,
  ArrowRight,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setError("Could not load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const data = stats || {
    total_predictions: 0,
    placement_rate: 0.0,
    avg_salary: 0.0,
    history: [],
    branch_stats: [],
    salary_distribution: []
  };

  // Safe mappings
  const branchData = (data.branch_stats && data.branch_stats.length > 0) 
    ? data.branch_stats.map(b => ({
        branch: b.branch,
        placement_rate: b.total ? Math.round((b.placed / b.total) * 100) : 0
      }))
    : [
        { branch: "CSE", placement_rate: 85 },
        { branch: "IT", placement_rate: 80 },
        { branch: "ECE", placement_rate: 70 },
        { branch: "EEE", placement_rate: 60 },
        { branch: "MECH", placement_rate: 55 },
        { branch: "CIVIL", placement_rate: 45 }
      ];

  const salaryData = (data.salary_distribution && data.salary_distribution.length > 0)
    ? data.salary_distribution
    : [
        { range: "3-5 LPA", count: 120 },
        { range: "5-7 LPA", count: 240 },
        { range: "7-10 LPA", count: 150 },
        { range: "10-15 LPA", count: 70 },
        { range: "15+ LPA", count: 20 }
      ];

  const skillsDemand = [
    { name: "Python", demand: 90 },
    { name: "SQL", demand: 80 },
    { name: "ML", demand: 75 },
    { name: "React", demand: 70 },
    { name: "Java", demand: 65 },
    { name: "Docker", demand: 50 }
  ];

  const statCards = [
    {
      title: "Your Placement Probability",
      value: data.history.length > 0 && data.history[0].probability !== undefined
        ? `${Math.round(data.history[0].probability * 100)}%` 
        : 'N/A',
      desc: data.history.length > 0 
        ? `Based on prediction run on ${new Date(data.history[0].created_at).toLocaleDateString()}` 
        : "No prediction run yet",
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Predicted Salary CTC",
      value: data.history.length > 0 && data.history[0].placed && data.avg_salary
        ? `${data.avg_salary.toFixed(1)} LPA` 
        : 'N/A',
      desc: "Estimated starting annual package",
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Predictions Run",
      value: data.total_predictions,
      desc: "Total profile simulations run",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  const COLORS = ['#6366F1', '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981'];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative glass p-8 rounded-3xl overflow-hidden shadow-lg border border-indigo-200 dark:border-indigo-900/10">
        <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[200%] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Career System Online</span>
          </span>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Welcome to PlaceWise Insights
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            Compare academic scores, test project parameters, inspect detail SHAP factor logs, and check career recommendations to identify pathways for target profiles.
          </p>
          <Link
            to="/predict"
            className="inline-flex items-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md shadow-indigo-600/20"
          >
            <span>Run Placement Predictor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {card.title}
                </p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">{card.value}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{card.desc}</p>
              </div>
              <div className={`p-4 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Branch-wise Placement & Salaries */}
        <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">
            Placement Rates & Starting Salaries by Branch
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData}>
                <XAxis dataKey="branch" stroke="#4B5563" fontSize={11} />
                <YAxis stroke="#4B5563" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F2937', borderRadius: '12px' }}
                  labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
                />
                <Bar dataKey="placement_rate" name="Placement Rate (%)" fill="#6366F1" radius={[4, 4, 0, 0]}>
                  {branchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Package Distribution */}
        <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">
            Market Starting Salary Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <XAxis dataKey="range" stroke="#4B5563" fontSize={11} />
                <YAxis stroke="#4B5563" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F2937', borderRadius: '12px' }}
                  labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" name="Students Placed" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Demands */}
        <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">
            Industry Skill Demand Index
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={skillsDemand}>
                <XAxis dataKey="name" stroke="#4B5563" fontSize={11} />
                <YAxis stroke="#4B5563" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F2937', borderRadius: '12px' }}
                  labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
                />
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="demand" name="Demand Score" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Prediction Activity List */}
        <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              Your Recent Simulations
            </h3>
            {data.history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No predictions run yet. Get started now!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {data.history.slice(0, 4).map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Student Profile
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(h.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {h.probability !== undefined ? `${Math.round(h.probability * 100)}% Prob` : ''}
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-1 ${
                        h.placed 
                          ? 'bg-emerald-50 dark:bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-400'
                      }`}>
                        {h.placed ? 'Placed' : 'Not Placed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {data.history.length > 0 && (
            <Link
              to="/profile"
              className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-700 dark:text-indigo-300 transition-colors pt-4 border-t border-gray-200 dark:border-gray-800/60"
            >
              View Full Prediction History
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
