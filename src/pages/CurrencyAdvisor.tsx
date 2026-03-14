import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurrencyRecommendation } from '../services/geminiService';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Coins, Sparkles, Globe, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

const CurrencyAdvisor = () => {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'recommendations'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(docs);
      if (docs.length > 0 && !recommendation) {
        setRecommendation(docs[0]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const generateNewRecommendation = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // In a real app, we'd fetch the latest prediction from Firestore
      // For now, we'll use some default/mock values if no prediction is found
      const mockProfile = {
        annualIncome: 750000,
        outstandingDebt: 50000,
        riskLevel: 'Low'
      };

      const result = await getCurrencyRecommendation(mockProfile);
      
      const newDoc = {
        userId: user.uid,
        timestamp: new Date().toISOString(),
        content: result.content,
        sources: result.sources
      };

      const docRef = await addDoc(collection(db, 'recommendations'), newDoc);
      const finalRec = { id: docRef.id, ...newDoc };
      
      setRecommendation(finalRec);
      setHistory(prev => [finalRec, ...prev].slice(0, 5));
    } catch (err: any) {
      setError("Failed to generate recommendation. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-6 bg-slate-900/50 rounded-full border border-white/5">
          <Coins className="w-16 h-16 text-slate-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Sign in to get AI Advisor</h2>
          <p className="text-slate-400 max-w-md">
            Connect your account to receive personalized currency recommendations based on your financial profile and real-time market data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Coins className="text-emerald-400" /> Currency Advisor
          </h2>
          <p className="text-slate-400">AI-powered insights grounded in real-time global market data.</p>
        </div>
        <button
          onClick={generateNewRecommendation}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Generate Recommendation
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 bg-slate-900/50 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <Globe className="w-8 h-8 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Analyzing Markets...</h3>
                  <p className="text-slate-400">Gemini is searching for the latest exchange rates and economic trends.</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-400"
              >
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            ) : recommendation ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                    Generated on {new Date(recommendation.timestamp).toLocaleDateString()} at {new Date(recommendation.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <Sparkles className="w-3 h-3" /> Grounded with Google Search
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <Markdown>{recommendation.content}</Markdown>
                </div>

                {recommendation.sources && recommendation.sources.length > 0 && (
                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Sources & References
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.sources.map((source: string, idx: number) => (
                        <a
                          key={idx}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-full flex items-center gap-2 transition-colors border border-white/5"
                        >
                          Source {idx + 1} <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="p-12 bg-slate-900/50 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <Sparkles className="w-12 h-12 text-slate-700" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-500">No Recommendation Yet</h3>
                  <p className="text-slate-600">Click the button above to get your first AI-powered currency advice.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" /> Recent History
            </h3>
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setRecommendation(item)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    recommendation?.id === item.id 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-tighter mb-1">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm line-clamp-2 opacity-80">
                    {item.content.substring(0, 100)}...
                  </div>
                </button>
              ))}
              {history.length === 0 && (
                <div className="text-center py-8 text-slate-600 text-sm italic">
                  No history available.
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 rounded-[2rem] space-y-4">
            <h3 className="font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Why use AI?
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our AI analyzes thousands of data points from global markets, inflation rates, and geopolitical events to provide you with tailored advice that matches your specific financial risk profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyAdvisor;
