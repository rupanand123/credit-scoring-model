import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Cpu, Database, PieChart, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">About the Project</h2>
        <p className="text-slate-400">Understanding the technology and methodology behind CreditGuard AI.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <BookOpen className="w-6 h-6" />
            <h3 className="text-xl font-bold">Objective</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            The primary goal of this project is to develop an intelligent system that can accurately predict an individual's 
            creditworthiness using historical financial data. By leveraging machine learning, we aim to provide 
            financial institutions with a reliable tool for risk assessment and loan approval processes.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-blue-400">
            <Cpu className="w-6 h-6" />
            <h3 className="text-xl font-bold">Technologies Used</h3>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {[
              "React 19", "TypeScript", "Express.js", "Vite", 
              "Tailwind CSS", "Random Forest", "Logistic Regression", "Recharts"
            ].map((tech, idx) => (
              <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-8">
        <div className="flex items-center gap-3 text-purple-400">
          <Database className="w-6 h-6" />
          <h3 className="text-xl font-bold">Dataset & Features</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Demographics</h4>
            <p className="text-sm text-slate-500">Age, Education Level, Marital Status, Employment Status.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Financials</h4>
            <p className="text-sm text-slate-500">Annual Income, Monthly Savings, Outstanding Debt, Total EMI.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Credit History</h4>
            <p className="text-sm text-slate-500">History Length, Delayed Payments, Credit Utilization, Active Loans.</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3 text-amber-400">
          <Shield className="w-6 h-6" />
          <h3 className="text-xl font-bold">Model Evaluation</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-slate-800/30 rounded-2xl border border-white/5">
            <h4 className="font-bold mb-2">Accuracy & Precision</h4>
            <p className="text-sm text-slate-400">
              Our Random Forest model achieves over 94% accuracy. Precision is prioritized to minimize "False Positives" 
              (approving risky candidates).
            </p>
          </div>
          <div className="p-6 bg-slate-800/30 rounded-2xl border border-white/5">
            <h4 className="font-bold mb-2">Explainability</h4>
            <p className="text-sm text-slate-400">
              We use feature importance analysis to provide users with clear reasons for their credit assessment, 
              ensuring transparency in AI decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
