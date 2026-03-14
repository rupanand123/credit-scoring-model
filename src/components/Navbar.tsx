import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Info, Home, CreditCard, Coins, LogIn, LogOut } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logout } from '../firebase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Predict', path: '/predict', icon: CreditCard },
    { name: 'Advisor', path: '/currency-advisor', icon: Coins },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              CreditGuard AI
            </span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              
              {user ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                  <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-emerald-500/20" />
                  <button
                    onClick={logout}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 rounded-lg text-sm font-bold hover:bg-emerald-400 transition-all ml-4"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
