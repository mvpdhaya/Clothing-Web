'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold text-gray-800 mb-6 inline-block">
            Flone<span className="text-red-400">.</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-500">
            {submitted
              ? 'Check your inbox for the reset link'
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-xl shadow-gray-100/50">
          {submitted ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center text-center gap-5 py-6">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-gray-800 mb-1">Email sent!</p>
                <p className="text-sm text-gray-500">
                  We've sent a password reset link to{' '}
                  <span className="font-semibold text-gray-700">{email}</span>
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[13px] text-red-400 font-bold hover:text-red-500 transition-colors"
              >
                Send again
              </button>
            </div>
          ) : (
            /* ── Form State ── */
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-red-400/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white rounded-2xl py-4 text-sm font-bold hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-200"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
