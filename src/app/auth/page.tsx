"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { setUserProfile } from "../../lib/firestore";


export default function AuthPage() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const accent = "bg-blue-600 text-white";
  const accentHover = "hover:bg-blue-700";
  const cardBg = "bg-white dark:bg-slate-900";
  const border = "border border-slate-200 dark:border-slate-700";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await setUserProfile(cred.user.uid, { email, role: "user", activePlan: "" });
        } catch (e) {
          console.error("Failed to create user profile:", e);
        }
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  if (user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className={`${cardBg} ${border} rounded-xl p-8 shadow-lg text-center`}>
        <h2 className="text-2xl font-bold mb-2 text-blue-600">Welcome!</h2>
        <div className="text-lg mb-4">{user.email}</div>
        <div className="text-slate-500 mb-2">You are signed in.</div>
        <a href="/dashboard" className={`${accent} ${accentHover} px-4 py-2 rounded font-semibold inline-block mt-2`}>Go to Dashboard</a>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-2">
      <div className={`${cardBg} ${border} rounded-xl p-8 shadow-lg w-full max-w-md mx-auto`}>
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">{isLogin ? "Sign In" : "Create Account"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className={`${accent} ${accentHover} px-4 py-2 rounded font-semibold transition-all duration-150 disabled:opacity-60`}
            disabled={submitting}
          >
            {submitting ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Create Account")}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline text-sm"
          >
            {isLogin ? "Create an account" : "Already have an account?"}
          </button>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2 text-sm text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}
