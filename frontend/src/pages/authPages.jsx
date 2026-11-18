import React, { useState } from 'react';
import { 
  Briefcase, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
} from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  
 const [users, setUsers] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('opportunityhub-users')) || [];
  } catch {
    return [];
  }
 });


  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const admins = [
    { name : 'admin',
     email :'admin@gmail.com',
     password :'admin123',
role:'admin'},

    ]

 const handleSubmit = (e) => {
  e.preventDefault();
  setError('');

  const email = formData.email.trim().toLowerCase();
  const password = formData.password;

  if (!email || !password) {
    setError('Please enter both email and password.');
    return;
  }

  // Admin login: credentials are declared in the admins array
  if (isLogin) {
    const admin = admins.find(
      (a) => a.email.toLowerCase() === email
    );

    if (admin) {
      if (admin.password !== password) {
        setError('Invalid admin credentials.');
        return;
      }

      onLoginSuccess({
        name: admin.name,
        email: admin.email,
        role: 'admin',
      });
      return;
    }

    // Verify registered user credentials
    const user = users.find(
      (u) => u.email.toLowerCase() === email &&
             u.password === password
    );

    if (!user) {
      setError('Invalid email or password. Please register first.');
      return;
    }

    onLoginSuccess({
      name: user.name,
      email: user.email,
      role: 'user',
    });

    return;
  }

  // User registration
  if (!formData.name.trim()) {
    setError('Please provide your full name.');
    return;
  }

  if (email === admins[0].email.toLowerCase()) {
    setError('This email is reserved for the administrator.');
    return;
  }

  if (password.length < 6) {
    setError('Password must be at least 6 characters long.');
    return;
  }

  if (password !== formData.confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  if (users.some((u) => u.email.toLowerCase() === email)) {
    setError('This email is already registered.');
    return;
  }

  const newUser = {
    name: formData.name.trim(),
    email,
    password,
    role: 'user',
  };

  setUsers((prev) => [...prev, newUser]);

  setFormData({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  setIsLogin(true);
};

  // Helper buttons to quickly test both accounts
  const fillSampleLogin = (type) => {
    setIsLogin(true);
    setError('');
    if (type === 'admin') {
      setFormData({
        name: '',
        email: 'admin@gmail.com',
        password: 'admin123',
        confirmPassword: '',
      });
    } else {
      setFormData({
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-100">
      <div className="w-full max-w-md overflow-hidden bg-white border shadow-xl rounded-2xl border-slate-200">
        {/* Header Banner */}
        <div className="p-6 text-center text-white bg-indigo-600">
          <div className="inline-flex p-3 mb-2 bg-white/10 rounded-xl backdrop-blur-sm">
            <Briefcase className="text-white w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold">OpportunityHub</h2>
          <p className="mt-1 text-xs text-indigo-100">
            {isLogin
              ? 'Sign in to access your portal'
              : 'Create a candidate account to apply'}
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              isLogin
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              !isLogin
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Candidate Register
          </button>
        </div>

        <div className="p-6">
          {/* Quick Demo Credentials Bar for Testing */}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute w-4 h-4 text-slate-400 left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-4 h-4 text-slate-400 left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={isLogin ? 'admin@gmail.com or user@gmail.com' : 'you@example.com'}
                  className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 border-slate-300 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-4 h-4 text-slate-400 left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full py-2 pr-10 text-sm border rounded-lg pl-9 border-slate-300 focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 text-slate-400 left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition flex items-center justify-center gap-1.5 shadow"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Candidate Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}