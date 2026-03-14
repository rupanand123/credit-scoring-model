import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Zap, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Home = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent blur-3xl -z-10" />
        
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Predict Creditworthiness with AI Precision
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Empower your financial decisions with our advanced machine learning model. 
            Analyze risk, predict approvals, and understand the factors driving credit scores.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/predict" 
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 group shadow-lg shadow-emerald-500/20"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-white/10 transition-all duration-200"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Advanced ML Models",
            desc: "Utilizing Random Forest and Logistic Regression for high-accuracy predictions.",
            icon: Zap,
            color: "text-amber-400"
          },
          {
            title: "Real-time Analytics",
            desc: "Instant feedback on creditworthiness based on comprehensive financial data.",
            icon: BarChart3,
            color: "text-blue-400"
          },
          {
            title: "Explainable AI",
            desc: "Get clear reasons behind every prediction to understand risk factors.",
            icon: ShieldCheck,
            color: "text-emerald-400"
          }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-emerald-500/30 transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
          >
            <feature.icon className={`w-12 h-12 ${feature.color} mb-6`} />
            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] p-12">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Model Accuracy", value: "94.2%" },
            { label: "Data Points", value: "10k+" },
            { label: "Risk Factors", value: "25+" },
            { label: "Processing Time", value: "<1s" }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
