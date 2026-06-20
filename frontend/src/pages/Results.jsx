import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  Sparkles, 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Award,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';

const Results = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('last_prediction');
    if (!raw) {
      navigate('/predict');
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch (e) {
      console.error(e);
      navigate('/predict');
    }
  }, [navigate]);

  if (!data) return null;

  const { input, result } = data;
  const placement = result.placement || {};
  const salary = result.salary || {};

  // Format SHAP data for Recharts
  const placementShap = placement.shap_values || { features: [], values: [] };
  const shapChartData = placementShap.features.map((feat, idx) => ({
    name: feat,
    value: placementShap.values[idx] || 0
  })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value)); // Sort by magnitude

  const handleDownloadPDF = async () => {
    if (!result.prediction_id) return;
    setPdfLoading(true);
    setError('');
    try {
      const response = await api.post(
        '/api/reports/generate', 
        { prediction_id: result.prediction_id, include_career_recs: true },
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `placewise_report_${result.prediction_id.substring(0, 8)}.pdf`;
      link.click();
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("Failed to download PDF report. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/predict" 
          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Predictor</span>
        </Link>

        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading || !result.prediction_id}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white text-xs font-semibold rounded-xl transition-all duration-300 shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          {pdfLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Generating Report...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Main Results KPI Panel */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Placement Classification Card */}
        <div className="glass p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                Placement Predictor
              </span>
              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-[10px] font-semibold rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>XGBoost Classifier</span>
              </span>
            </div>
            
            <h3 className="text-sm font-semibold text-gray-500 mb-1">Status Classification</h3>
            <div className="flex items-baseline space-x-3 mb-6">
              <span className={`text-4xl font-black ${placement.placed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-400'}`}>
                {placement.placed ? 'Placed' : 'Not Placed'}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                (Confidence: {placement.confidence})
              </span>
            </div>
          </div>

          <div>
            <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 flex mb-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.round(placement.probability * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
              <span>Probability Estimate</span>
              <span className="text-indigo-600 dark:text-indigo-400">{Math.round(placement.probability * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Salary Regressor Card */}
        <div className="glass p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                Salary Package Predictor
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>XGBoost Regressor</span>
              </span>
            </div>

            <h3 className="text-sm font-semibold text-gray-500 mb-1">Expected CTC Package</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                {placement.placed ? `${salary.salary_lpa.toFixed(1)}` : '0.0'}
              </span>
              <span className="text-lg font-bold text-gray-600 dark:text-gray-400">LPA</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {placement.placed 
                ? `Estimate Confidence Range: ${salary.salary_range?.min?.toFixed(1)} to ${salary.salary_range?.max?.toFixed(1)} LPA` 
                : "No CTC estimate generated for unplaced profile"}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800/60 flex items-center space-x-2 text-xs text-gray-500">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            <span>Predicted package range based on branch performance.</span>
          </div>
        </div>
      </div>

      {/* SHAP Explainability Section */}
      <div className="glass p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>SHAP Feature Attribution</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Visualizes how much each of your profile parameters contributes to the placement probability.
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
              <span>Pos. Impact</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span>
              <span>Neg. Impact</span>
            </span>
          </div>
        </div>

        {/* SHAP bar chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={shapChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" stroke="#4B5563" fontSize={10} />
              <YAxis dataKey="name" type="category" stroke="#4B5563" fontSize={10} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F2937', borderRadius: '12px' }}
                itemStyle={{ color: '#F3F4F6', fontSize: '12px' }}
                cursor={{ fill: '#1F2937', opacity: 0.2 }}
              />
              <ReferenceLine x={0} stroke="#4B5563" strokeWidth={1} />
              <Bar dataKey="value" name="SHAP Value Attribution">
                {shapChartData.map((entry, index) => {
                  const isPositive = entry.value >= 0;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={isPositive ? '#10B981' : '#F43F5E'} 
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Results;
