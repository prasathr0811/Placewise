import React, { useEffect, useState } from 'react';
import api from '../api';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  MapPin,
  BookmarkCheck
} from 'lucide-react';

const CareerRecs = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await api.get('/api/careers/recommendations');
        setRecs(res.data.recommendations);
      } catch (err) {
        console.error("Failed to load career recommendations:", err);
        setError("Could not load career recommendations.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Intro Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>AI Career Recommendations</span>
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Cosine similarity matching engines suggest roles that fit your active skillsets and outline missing requirements.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Recs Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {recs.map((rec) => (
          <div key={rec.role_name} className="glass p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between glass-hover">
            <div>
              {/* Card Top */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {rec.domain}
                </span>
                <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-full ${
                  rec.match_percentage > 70 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400' 
                    : rec.match_percentage > 40
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/40 text-amber-700 dark:text-amber-400'
                }`}>
                  {rec.match_percentage}% Match
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center space-x-2">
                <span>{rec.role_name}</span>
                {rec.match_percentage > 80 && (
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                )}
              </h3>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 my-4 p-3 bg-gray-100 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800/60 rounded-xl text-xs">
                <div>
                  <p className="text-gray-500 uppercase font-semibold tracking-wider text-[9px] mb-0.5">Average Package</p>
                  <p className="text-gray-700 dark:text-gray-300 font-bold">{rec.avg_salary_range}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase font-semibold tracking-wider text-[9px] mb-0.5">Market Growth</p>
                  <p className="text-gray-700 dark:text-gray-300 font-bold text-emerald-600 dark:text-emerald-400">{rec.growth_outlook}</p>
                </div>
              </div>

              {/* Skills breakdown */}
              <div className="space-y-2 mt-4">
                <div className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400 tracking-wider">Skills Status</div>
                
                {/* Matched skills */}
                {rec.required_skills.filter(s => !rec.missing_skills.includes(s)).length > 0 && (
                  <div className="flex items-start space-x-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {rec.required_skills.filter(s => !rec.missing_skills.includes(s)).slice(0, 3).map(skill => (
                        <span key={skill} className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-medium border border-emerald-900/10">
                          {skill}
                        </span>
                      ))}
                      {rec.required_skills.filter(s => !rec.missing_skills.includes(s)).length > 3 && (
                        <span className="text-[9px] text-gray-500 font-semibold self-center">
                          +{rec.required_skills.filter(s => !rec.missing_skills.includes(s)).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Missing skills */}
                {rec.missing_skills.length > 0 && (
                  <div className="flex items-start space-x-2 text-xs">
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-500 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {rec.missing_skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded text-[10px] font-medium border border-rose-900/10">
                          {skill}
                        </span>
                      ))}
                      {rec.missing_skills.length > 3 && (
                        <span className="text-[9px] text-gray-500 font-semibold self-center">
                          +{rec.missing_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA action */}
            <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800/60 flex items-center justify-between text-xs">
              <span className="text-gray-500">Suggested focus area</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center space-x-1">
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Learn {rec.missing_skills.length > 0 ? rec.missing_skills[0] : 'Advanced concepts'}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerRecs;
