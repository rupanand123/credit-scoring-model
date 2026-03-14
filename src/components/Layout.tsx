import React from 'react';
import Navbar from './Navbar';
import { motion } from 'motion/react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      <Navbar />
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 CreditGuard AI. Intelligent Credit Scoring Solutions.</p>
      </footer>
    </div>
  );
};

export default Layout;
