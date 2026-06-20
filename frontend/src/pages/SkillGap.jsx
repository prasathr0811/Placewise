import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const SkillGap = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch list of roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/api/skills/roles');
        setRoles(res.data.roles);
        if (res.data.roles.length > 0) {
          setSelectedRole(res.data.roles[0]);
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        setError("Could not load roles for analysis.");
      }
    };
    fetchRoles();
  }, []);

  // Run gap analysis whenever selected role or user skills change
  useEffect(() => {
    if (!selectedRole || !user) return;
    
    const runAnalysis = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.post('/api/skills/gap-analysis', {
          student_skills: user.skills || [],
          target_role: selectedRole
        });
        setAnalysis(res.data);
      } catch (err) {
        console.error("Gap analysis failed:", err);
        setError("Analysis failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    runAnalysis();
  }, [selectedRole, user]);

  // Prep Radar chart data
  // We want to map required skills and assign 1 if matched, 0 if missing.
  const chartData = analysis
    ? analysis.required_skills.map(skill => ({
        subject: skill,
        required: 100,
        current: analysis.matched_skills.includes(skill) ? 100 : 0
      }))
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Skill Gap & Matching Matrix</span>
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Map your skills against target roles to see compatibility and priority growth targets</p>
        </div>

        {/* Role Selector */}
        {roles.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Target Role:
            </span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : analysis ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Skill lists (Matched vs. Missing) */}
          <div className="glass p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Compatibility Profile</h3>
                <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                  {analysis.match_percentage}% Match
                </span>
              </div>
              <p className="text-xs text-gray-500">Based on your active skills profile compared to the baseline {selectedRole} requirements.</p>
            </div>

            {/* Matched skills */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Matched Skills ({analysis.matched_skills.length})</span>
              </h4>
              {analysis.matched_skills.length === 0 ? (
                <p className="text-xs text-gray-500 italic pl-6">No skills matched yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2 pl-6">
                  {analysis.matched_skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing skills */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Missing Skills ({analysis.missing_skills.length})</span>
              </h4>
              {analysis.missing_skills.length === 0 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 italic pl-6 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All required skills are present! Excellent work.</span>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 pl-6">
                  {analysis.missing_skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended/Priority Skills */}
            {analysis.priority_skills.length > 0 && (
              <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Priority Targets for Upskilling</span>
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Focus on acquiring these high-impact skills first to significantly increase your compatibility rate:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.priority_skills.map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-md flex items-center space-x-1">
                      <Bookmark className="w-3 h-3" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Radar Chart Visualizer */}
          <div className="glass p-8 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between items-center">
            <div className="w-full text-left mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Radar Mapping</h3>
              <p className="text-xs text-gray-500">Compares your current level (100% matched, 0% missing) against target thresholds.</p>
            </div>

            {chartData.length > 0 ? (
              <div className="w-full h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                    <PolarGrid stroke={theme === 'dark' ? '#1F2937' : '#E5E7EB'} />
                    <PolarAngleAxis dataKey="subject" stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={theme === 'dark' ? '#4B5563' : '#D1D5DB'} tick={false} />
                    <Radar 
                      name="Required" 
                      dataKey="required" 
                      stroke="#4F46E5" 
                      fill="#4F46E5" 
                      fillOpacity={0.05} 
                    />
                    <Radar 
                      name="Current" 
                      dataKey="current" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.25} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20">
                No mapping available.
              </div>
            )}

            <div className="flex items-center space-x-6 text-[10px] font-bold text-gray-600 dark:text-gray-400 mt-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                <span>Required Skills (100%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span>Your Matched Profile</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SkillGap;
