'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold text-gray-800 mb-6 inline-block">
            Flone<span className="text-red-400">.</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-xl shadow-gray-100/50">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-red-400/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[12px] font-bold text-red-400 hover:text-red-500 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 text-[15px] outline-none focus:ring-2 focus:ring-red-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" onClick={() => window.location.href = '/'} className="w-full bg-gray-900 text-white rounded-2xl py-4 text-sm font-bold hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-200">
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center text-[14px] text-gray-500">
            No account yet?{' '}
            <Link href="/register" className="text-red-400 font-bold hover:text-red-500 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
