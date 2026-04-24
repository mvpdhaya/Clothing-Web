'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitted(true);
  };

  const strength = newPass.length === 0
    ? 0
    : newPass.length < 6
    ? 1
    : newPass.length < 10
    ? 2
    : 3;

  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-green-400'];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold text-gray-800 mb-6 inline-block">
            Flone<span className="text-red-400">.</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Password</h1>
          <p className="text-sm text-gray-500">
            {submitted ? 'Your password has been updated' : 'Choose a strong new password'}
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
                <p className="text-[15px] font-semibold text-gray-800 mb-1">Password updated!</p>
                <p className="text-sm text-gray-500">You can now sign in with your new password.</p>
              </div>
              <Link
                href="/login"
                className="w-full block bg-gray-900 text-white rounded-2xl py-4 text-sm font-bold hover:bg-black transition-all text-center mt-2"
              >
                Sign In
              </Link>
            </div>
          ) : (
            /* ── Form State ── */
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 text-[15px] outline-none focus:ring-2 focus:ring-red-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength bar */}
                {newPass.length > 0 && (
                  <div className="flex items-center gap-3 mt-2 ml-1">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            strength >= level ? strengthColor[strength] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-[11px] font-bold ${
                      strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-500' : 'text-green-500'
                    }`}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-400 transition-colors" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-12 text-[15px] outline-none focus:ring-2 focus:ring-red-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPass.length > 0 && (
                  <p className={`text-[11px] font-bold ml-1 transition-colors ${
                    newPass === confirmPass ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {newPass === confirmPass ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="text-[13px] text-red-400 font-medium text-center -mt-2">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gray-900 text-white rounded-2xl py-4 text-sm font-bold hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-200"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
