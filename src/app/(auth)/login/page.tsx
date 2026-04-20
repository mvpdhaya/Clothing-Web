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
          <Link href="/" className="font-display text-3xl font-bold tracking-widest text-brand-black inline-block mb-6">
            LUMIÈRE
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Welcome back</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Sign in to your account to continue</p>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-sm">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--color-text-muted)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--color-text-muted)]">
                  Password
                </label>
                <button type="button" className="text-[11px] text-[var(--color-text-muted)] hover:text-brand-black transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-brand-black transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 text-xs mt-2">
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-muted)]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-black font-semibold hover:underline underline-offset-2">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
