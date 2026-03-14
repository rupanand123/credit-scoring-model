import React, { useEffect, useState } from 'react';
import { mlService, ModelMetrics } from '../services/MLService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Activity, Target, Zap, ShieldCheck, History } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Ensure model is trained
    mlService.train();
    setMetrics(mlService.getMetrics());

    // Fetch history
    fetch('/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, []);

  if (!metrics) return <div className="text-center py-20">Loading Metrics...</div>;

  const confusionData = [
    { name: 'True Negative', value: metrics.confusionMatrix[0][0] },
    { name: 'False Positive', value: metrics.confusionMatrix[0][1] },
    { name: 'False Negative', value: metrics.confusionMatrix[1][0] },
    { name: 'True Positive', value: metrics.confusionMatrix[1][1] },
  ];

  const modelComparison = [
    { name: 'Logistic Regression', accuracy: 88, precision: 85, recall: 82 },
    { name: 'Decision Tree', accuracy: 91, precision: 89, recall: 87 },
    { name: 'Random Forest', accuracy: 94, precision: 92, recall: 90 },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold">Model Analytics</h2>
          <p className="text-slate-400">Performance metrics and prediction insights.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium">
            Model: Random Forest
          </div>
          <div className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium">
            Status: Optimized
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Accuracy', value: (metrics.accuracy * 100).toFixed(1) + '%', icon: Target, color: 'text-emerald-400' },
          { label: 'Precision', value: (metrics.precision * 100).toFixed(1) + '%', icon: Zap, color: 'text-amber-400' },
          { label: 'Recall', value: (metrics.recall * 100).toFixed(1) + '%', icon: Activity, color: 'text-blue-400' },
          { label: 'F1 Score', value: (metrics.f1Score * 100).toFixed(1) + '%', icon: ShieldCheck, color: 'text-purple-400' },
        ].map((m, idx) => (
          <div key={idx} className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl space-y-2">
            <m.icon className={`w-5 h-5 ${m.color}`} />
            <div className="text-2xl font-bold">{m.value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Model Comparison */}
        <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-6">
          <h3 className="text-xl font-bold">Model Comparison</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="precision" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix Visualization */}
        <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-6">
          <h3 className="text-xl font-bold">Confusion Matrix Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confusionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {confusionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {confusionData.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-slate-400">{c.name}: {c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prediction History */}
      <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" /> Recent Predictions
          </h3>
          <span className="text-xs text-slate-500">{history.length} Total Records</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-white/5">
                <th className="pb-4 font-medium">Timestamp</th>
                <th className="pb-4 font-medium">Income</th>
                <th className="pb-4 font-medium">Debt</th>
                <th className="pb-4 font-medium">Result</th>
                <th className="pb-4 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.length > 0 ? history.slice(-5).reverse().map((item, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="py-4 text-slate-400">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="py-4">₹{item.input.annualIncome.toLocaleString()}</td>
                  <td className="py-4">₹{item.input.outstandingDebt.toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      item.result.prediction === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {item.result.prediction}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{(item.result.confidence * 100).toFixed(1)}%</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No predictions yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
