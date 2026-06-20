import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

const AVAILABLE_SKILLS = [
  "Python", "Java", "SQL", "ML", "Deep Learning", "NLP",
  "React", "Node.js", "AWS", "Docker", "Git", "Statistics",
  "Excel", "Tableau", "Power BI", "C++", "Data Analysis",
  "Communication", "Leadership", "Problem Solving"
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] relative overflow-hidden flex items-center justify-center py-12 px-6">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl w-full z-10">
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Join and start modeling your career pathways with AI</p>
        </div>

        {/* Register Form Box */}
        <div className="glass p-8 md:p-10 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create Your Profile</h2>

          {error && (
            <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Credentials */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@university.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Academic Profiles */}
            <div className="border-t border-gray-200 dark:border-gray-800/80 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Academic & Academic Performance Profile</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Department / Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
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
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Gender
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
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Current CGPA
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

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Active/Past Backlogs
                  </label>
                  <input
                    type="number"
                    name="backlogs"
                    min="0"
                    required
                    value={formData.backlogs}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Internships Completed
                  </label>
                  <input
                    type="number"
                    name="internships"
                    min="0"
                    required
                    value={formData.internships}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Academic Projects
                  </label>
                  <input
                    type="number"
                    name="projects"
                    min="0"
                    required
                    value={formData.projects}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#090D1A]/60 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Aptitude Score (%)
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
            </div>

            {/* Skills selection */}
            <div className="border-t border-gray-200 dark:border-gray-800/80 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Technical & Soft Skills</h3>
                <span className="text-xs text-gray-500">Select all that apply</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-white dark:bg-[#090D1A]/40 border border-gray-200 dark:border-gray-800/60 rounded-xl">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = formData.skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{loading ? 'Generating Account...' : 'Complete & Register'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-700 dark:text-indigo-300 font-semibold transition-all">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
