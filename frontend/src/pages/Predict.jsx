import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const AVAILABLE_SKILLS = [
  "Python", "Java", "SQL", "ML", "Deep Learning", "NLP",
  "React", "Node.js", "AWS", "Docker", "Git", "Statistics",
  "Excel", "Tableau", "Power BI", "C++", "Data Analysis",
  "Communication", "Leadership", "Problem Solving"
];

const Predict = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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

  // Prefill form from user account data if present
  useEffect(() => {
    if (user) {
      setFormData({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['cgpa', 'internships', 'backlogs', 'projects', 'certifications', 'aptitude_score', 'communication_score'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Trigger combined predictions
      const res = await api.post('/api/predict/combined', formData);
      // Save full result payload to state or localStorage to pass to Results page
      localStorage.setItem('last_prediction', JSON.stringify({
        input: formData,
        result: res.data
      }));
      navigate('/results');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Simulation run failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Intro Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Prediction Workspace</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">Tweak your profile parameters to see mock prediction runs & SHAP explainability analyses</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Input Form Box */}
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl shadow-xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Branch / Major
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="CSE">CSE (Computer Science)</option>
              <option value="IT">IT (Information Tech)</option>
              <option value="ECE">ECE (Electronics & Comm)</option>
              <option value="EEE">EEE (Electrical & Electronics)</option>
              <option value="MECH">MECH (Mechanical)</option>
              <option value="CIVIL">CIVIL (Civil)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Gender Code
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Cumulative CGPA</span>
              <HelpCircle className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 dark:text-gray-300" title="Values 0.0 to 10.0" />
            </label>
            <input
              type="number"
              name="cgpa"
              step="0.01"
              min="0"
              max="10"
              required
              value={formData.cgpa}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Academic metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800/60">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Internships
            </label>
            <input
              type="number"
              name="internships"
              min="0"
              max="10"
              required
              value={formData.internships}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Active Backlogs
            </label>
            <input
              type="number"
              name="backlogs"
              min="0"
              max="10"
              required
              value={formData.backlogs}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Core Projects
            </label>
            <input
              type="number"
              name="projects"
              min="0"
              max="10"
              required
              value={formData.projects}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Certifications
            </label>
            <input
              type="number"
              name="certifications"
              min="0"
              max="10"
              required
              value={formData.certifications}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Test Performance row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800/60">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Quantitative Aptitude Score (%)
            </label>
            <input
              type="number"
              name="aptitude_score"
              min="0"
              max="100"
              required
              value={formData.aptitude_score}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Communication Score (%)
            </label>
            <input
              type="number"
              name="communication_score"
              min="0"
              max="100"
              required
              value={formData.communication_score}
              onChange={handleInputChange}
              className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Skills select box */}
        <div className="border-t border-gray-200 dark:border-gray-800/80 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">Skills Profile Selection</h3>
            <span className="text-xs text-gray-500">Toggle skill tags to recalculate ML features</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-2 bg-white dark:bg-[#090D1A]/40 border border-gray-200 dark:border-gray-800/60 rounded-xl">
            {AVAILABLE_SKILLS.map((skill) => {
              const isSelected = formData.skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 border border-indigo-500 text-white shadow-md shadow-indigo-600/10'
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
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:bg-indigo-700/50 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Simulating Model Trees...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              <span>Simulate Placement & Salary CTC</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Predict;
