"use client";

import { useState, useTransition } from "react";
import { loginAction } from "../actions";
import { Crown, Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result && result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
        
        {/* Visual Brand Accents */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

        <div className="flex flex-col items-center text-center mb-8 mt-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
            <Crown size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">APEX EVENT Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Please authenticate to access admin features.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Authentication failed</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                placeholder="Enter admin username"
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                placeholder="Enter password"
                disabled={isPending}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/95 transition-all shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed text-sm mt-2 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
