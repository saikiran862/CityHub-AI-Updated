import React, { useState } from 'react';
import Logo from './Logo';
import { User } from '../types';
import { AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, LockKeyhole, Mail, User as UserIcon } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form States
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Used primarily in Register
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    // 1. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // 2. Username Validation (Register only)
    if (mode === 'register') {
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(username)) {
        return "Username must contain only letters and numbers (no spaces).";
      }
    }

    // 3. Password Complexity
    const passwordRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!passwordRegex.test(password)) {
      return "Password must contain at least one special character (!@#$).";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    // 4. Confirm Password (Register & Forgot)
    if ((mode === 'register' || mode === 'forgot') && password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Mock API Call
    setTimeout(() => {
      setLoading(false);

      if (mode === 'forgot') {
        setSuccessMsg('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          switchMode('login');
        }, 2000);
        return;
      }

      if (mode === 'register') {
        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
           // Auto-login after register
           const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
           onLogin({ username, role });
        }, 1500);
        return;
      }

      // Login Logic
      // For login, we derive a display name from the email if it wasn't captured (or mock it)
      const displayUsername = username || email.split('@')[0]; 
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      onLogin({ username: displayUsername, role });

    }, 1500);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    // We generally keep email filled if switching between modes for convenience
  };

  const getTitle = () => {
    switch(mode) {
      case 'login': return 'Welcome Back';
      case 'register': return 'Create Account';
      case 'forgot': return 'Reset Password';
    }
  };

  const getButtonText = () => {
    switch(mode) {
      case 'login': return 'Sign In';
      case 'register': return 'Sign Up';
      case 'forgot': return 'Update Password';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">CityHub AI</h1>
        <p className="text-slate-500 mt-2">Your Urban Life, Simplified</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 transition-all duration-300">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{getTitle()}</h2>
        <p className="text-slate-500 text-sm mb-6">
          {mode === 'forgot' 
            ? 'Enter your email and a new secure password.' 
            : mode === 'register' 
            ? 'Join us to book parking and movies seamlessly.' 
            : 'Enter your email to access your dashboard.'}
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-700 text-sm animate-in fade-in zoom-in duration-300">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <p>{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 text-emerald-700 text-sm animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="shrink-0 mt-0.5" size={16} />
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field - Always Visible */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 focus:bg-white pl-10"
                placeholder="name@example.com"
                required
              />
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          {/* Username Field - Register Only */}
          {mode === 'register' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 focus:bg-white pl-10"
                  placeholder="Choose a display name"
                  required
                />
                <UserIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
              <p className="text-xs text-slate-400 mt-1">Only letters and numbers allowed</p>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {mode === 'forgot' ? 'New Password' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 focus:bg-white pl-10"
                placeholder="••••••••"
                required
              />
              <LockKeyhole className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
            {(mode === 'register' || mode === 'forgot') && (
              <p className="text-xs text-slate-400 mt-1">Must include a special character (!@#$)</p>
            )}
          </div>

          {/* Confirm Password Field - Register & Forgot Only */}
          {(mode === 'register' || mode === 'forgot') && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 focus:bg-white pl-10"
                  placeholder="••••••••"
                  required
                />
                <CheckCircle2 className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
          )}

          {/* Forgot Password Link - Login Only */}
          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {getButtonText()}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === 'forgot' ? (
             <button 
               onClick={() => switchMode('login')}
               className="text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
             >
               <ArrowLeft size={16} /> Back to Login
             </button>
          ) : (
            <p className="text-sm text-slate-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;