import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Download, RefreshCcw } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, input } = location.state || {};

  if (!result) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold">No Result Found</h2>
        <p className="text-slate-400">Please go back to the prediction page and fill in the details.</p>
        <Link to="/predict" className="inline-block px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl font-semibold">
          Go to Predict
        </Link>
      </div>
    );
  }

  const isApproved = result.prediction === 'Approved';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Assessment Result</h2>
        <p className="text-slate-400">Based on our AI model's analysis of your financial profile.</p>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-12 rounded-[3rem] border-2 text-center space-y-8 shadow-2xl ${
          isApproved 
            ? 'bg-emerald-500/5 border-emerald-500/20' 
            : 'bg-red-500/5 border-red-500/20'
        }`}
      >
        <div className="flex justify-center">
          {isApproved ? (
            <CheckCircle2 className="w-24 h-24 text-emerald-400" />
          ) : (
            <XCircle className="w-24 h-24 text-red-400" />
          )}
        </div>

        <div className="space-y-2">
          <div className={`text-5xl font-black uppercase tracking-tighter ${
            isApproved ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {result.prediction}
          </div>
          <div className="text-slate-400 font-medium">
            Risk Level: <span className={isApproved ? 'text-emerald-400' : 'text-red-400'}>{result.riskLevel}</span>
          </div>
          <div className="text-slate-500 text-sm">
            Confidence Score: {(result.confidence * 100).toFixed(1)}%
          </div>
        </div>

        <div className="max-w-md mx-auto p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-left">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Key Factors</h4>
          <ul className="space-y-3">
            {result.reasons.map((reason: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isApproved ? 'bg-emerald-400' : 'bg-red-400'}`} />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Download Report
          </button>
          <button 
            onClick={() => navigate('/predict')}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> New Prediction
          </button>
        </div>
      </motion.div>

      {/* Recommendations */}
      <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 space-y-6">
        <h3 className="text-xl font-bold">Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-800/50 rounded-2xl space-y-2">
            <h4 className="font-semibold text-emerald-400">Improve Score</h4>
            <p className="text-sm text-slate-400">Maintain a credit utilization ratio below 30% and ensure all payments are made on time.</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-2xl space-y-2">
            <h4 className="font-semibold text-blue-400">Financial Stability</h4>
            <p className="text-sm text-slate-400">Avoid taking multiple loans simultaneously and keep a healthy debt-to-income ratio.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
