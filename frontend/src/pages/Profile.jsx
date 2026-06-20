import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  User, 
  Sparkles, 
  Save, 
  BookOpen, 
  Check, 
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

const AVAILABLE_SKILLS = [
  "Python", "Java", "SQL", "ML", "Deep Learning", "NLP",
  "React", "Node.js", "AWS", "Docker", "Git", "Statistics",
  "Excel", "Tableau", "Power BI", "C++", "Data Analysis",
  "Communication", "Leadership", "Problem Solving"
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    branch: 'CSE',
    gender: 'M',
    cgpa: 7.5,
    internships: 0,
    backlogs: 0,
    projects: 1,
    certifications: 1,
    aptitude_score: 70,
    communication_score: 70,
    skills: []
  });

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load user data on mount/change
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        branch: user.branch || 'CSE',
        gender: user.gender || 'M',
        cgpa: user.cgpa || 7.5,
        internships: user.internships || 0,
        backlogs: user.backlogs || 0,
        projects: user.projects || 1,
        certifications: user.certifications || 1,
        aptitude_score: user.aptitude_score || 70,
        communication_score: user.communication_score || 70,
        skills: user.skills || []
      });
    }
  }, [user]);

  // Load prediction history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/predict/history');
        setHistory(res.data.history);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: ['cgpa', 'internships', 'backlogs', 'projects', 'certifications', 'aptitude_score', 'communication_score'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const toggleSkill = (skill) => {
    setProfileData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaveSuccess(false);
    setSaveLoading(true);
    try {
      await updateProfile(profileData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Intro Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>My Profile & Prediction History</span>
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Manage academic values, update technical skills, and check past simulations</p>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-900/50 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-start space-x-3">
          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">Profile updated successfully! Academic values modified in database.</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Editing Form Box */}
        <form onSubmit={handleSave} className="lg:col-span-2 glass p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Modify Academic Parameters</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Name</label>
              <input
                type="text"
                name="name"
                required
                value={profileData.name}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Branch</label>
              <select
                name="branch"
                value={profileData.branch}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">CGPA</label>
              <input
                type="number"
                name="cgpa"
                step="0.01"
                min="0"
                max="10"
                required
                value={profileData.cgpa}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Backlogs</label>
              <input
                type="number"
                name="backlogs"
                min="0"
                required
                value={profileData.backlogs}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Internships</label>
              <input
                type="number"
                name="internships"
                min="0"
                required
                value={profileData.internships}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Projects</label>
              <input
                type="number"
                name="projects"
                min="0"
                required
                value={profileData.projects}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Aptitude Score (%)</label>
              <input
                type="number"
                name="aptitude_score"
                min="0"
                max="100"
                required
                value={profileData.aptitude_score}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Comm. Score (%)</label>
              <input
                type="number"
                name="communication_score"
                min="0"
                max="100"
                required
                value={profileData.communication_score}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-4 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Skill tags */}
          <div className="border-t border-gray-200 dark:border-gray-800/80 pt-6">
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3">Skills Selection</label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-white dark:bg-[#090D1A]/40 border border-gray-200 dark:border-gray-800/60 rounded-xl">
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = profileData.skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 border border-indigo-500 text-white'
                        : 'bg-gray-100 dark:bg-[#111827]/40 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-700 hover:text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saveLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {saveLoading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Profile Parameters</span>
          </button>
        </form>

        {/* Prediction Logs / History sidebar */}
        <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Simulations Audit Log</span>
          </h3>

          {historyLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No prediction history found.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {history.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => {
                    localStorage.setItem('last_prediction', JSON.stringify({
                      input: h.input_features,
                      result: {
                        prediction_id: h.id,
                        placement: h.placement_result,
                        salary: h.salary_result
                      }
                    }));
                    window.location.href = '/results';
                  }}
                  className="p-3 bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-semibold">
                      {new Date(h.created_at).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      h.placement_result?.placed 
                        ? 'bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400'
                    }`}>
                      {h.placement_result?.placed ? 'Placed' : 'Not Placed'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Prob: {Math.round(h.placement_result?.probability * 100)}%</span>
                    <span className="text-indigo-700 dark:text-indigo-400 font-bold flex items-center space-x-0.5">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
