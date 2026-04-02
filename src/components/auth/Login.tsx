"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";

export default function Login({ onToggleMode }: { onToggleMode: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    setSuccess("");

    console.log("Login button clicked. Attempting to sign in:", email);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully!", userCredential.user);
      
      setSuccess("Logged in successfully!");
      // We don't usually clear inputs on successful login if it redirects,
      // but keeping it as requested.
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("Firebase Login Error:", err.code, err.message);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Failed to log in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-brand-950">Welcome Back</h2>
      
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 text-green-700 text-sm">{success}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" 
            required 
            placeholder="admin@themudhouse.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" 
            required 
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-800 text-white py-3 rounded-lg hover:bg-brand-900 transition-colors flex justify-center disabled:bg-brand-400 mt-6 font-medium shadow-sm"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <button onClick={onToggleMode} className="text-brand-600 font-semibold hover:underline">
          Sign Up
        </button>
      </div>
    </div>
  );
}
