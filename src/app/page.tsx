'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test');
  const [role, setRole] = useState<UserRole>('policyholder');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@claimpilot.com', role);
    router.push(role === 'policyholder' ? '/dashboard' : '/adjuster');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dot-grid-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            ClaimPilot
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            AI-powered claims processing
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter any password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Sign in as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('policyholder')}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    role === 'policyholder'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-lg mb-1">&#128100;</div>
                  Policyholder
                </button>
                <button
                  type="button"
                  onClick={() => setRole('adjuster')}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    role === 'adjuster'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-lg mb-1">&#128736;&#65039;</div>
                  Claims Adjuster
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            Demo mode — any credentials accepted
          </p>
        </div>
      </motion.div>
    </div>
  );
}
