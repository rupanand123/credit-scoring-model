import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mlService, CreditData } from '../services/MLService';
import { motion } from 'motion/react';
import { Calculator, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, auth as firebaseAuth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: firebaseAuth.currentUser?.uid,
      email: firebaseAuth.currentUser?.email,
      emailVerified: firebaseAuth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const Predict = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreditData>>({
    age: 30,
    annualIncome: 50000,
    employmentStatus: 'Employed',
    creditHistoryLength: 5,
    numCreditCards: 2,
    numLoans: 0,
    outstandingDebt: 5000,
    totalEMI: 500,
    delayedPaymentCount: 0,
    creditUtilization: 0.3,
    loanAmount: 10000,
    interestRate: 10,
    dependents: 0,
    education: 'Bachelor',
    maritalStatus: 'Single'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['age', 'annualIncome', 'creditHistoryLength', 'numCreditCards', 'numLoans', 'outstandingDebt', 'totalEMI', 'delayedPaymentCount', 'creditUtilization', 'loanAmount', 'interestRate', 'dependents'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) 
        ? (value === '' ? undefined : (isNaN(parseFloat(value)) ? 0 : parseFloat(value))) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing
    setTimeout(async () => {
      const result = mlService.predict(formData);
      
      // Save to Firestore if logged in
      if (user) {
        const path = 'predictions';
        try {
          await addDoc(collection(db, path), {
            userId: user.uid,
            timestamp: new Date().toISOString(),
            input: formData,
            result
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      } else {
        // Fallback to local API for anonymous users (if server.ts supports it)
        try {
          await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: formData, result })
          });
        } catch (err) {
          console.error("Failed to save history locally", err);
        }
      }

      setLoading(false);
      navigate('/result', { state: { result, input: formData } });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Credit Assessment</h2>
        <p className="text-slate-400">Fill in the financial details below to get an instant creditworthiness prediction.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
              <Calculator className="w-5 h-5" /> Personal & Employment
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Age</label>
              <input 
                type="number" name="age" value={formData.age ?? ''} onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Employment Status</label>
              <select 
                name="employmentStatus" value={formData.employmentStatus} onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              >
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Self-Employed">Self-Employed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Annual Income (₹)</label>
              <input 
                type="number" name="annualIncome" value={formData.annualIncome ?? ''} onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Education</label>
              <select 
                name="education" value={formData.education} onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              >
                <option value="High School">High School</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>

          {/* Financial Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
              <Calculator className="w-5 h-5" /> Financial History
            </h3>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Credit History Length (Years)</label>
              <input 
                type="number" name="creditHistoryLength" value={formData.creditHistoryLength ?? ''} onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Delayed Payments Count</label>
              <input 
                type="number" name="delayedPaymentCount" value={formData.delayedPaymentCount ?? ''} onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Outstanding Debt (₹)</label>
              <input 
                type="number" name="outstandingDebt" value={formData.outstandingDebt ?? ''} onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Credit Utilization (0.0 - 1.0)</label>
              <input 
                type="number" step="0.1" name="creditUtilization" value={formData.creditUtilization ?? ''} onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-12">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Analyzing Profile...
              </>
            ) : (
              <>
                Analyze Creditworthiness
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Predict;
