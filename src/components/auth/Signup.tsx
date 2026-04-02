"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";

export default function Signup({ onToggleMode }: { onToggleMode: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError("");
    setSuccess("");
    
    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    console.log("Signup button clicked. Attempting to register:", email);
    setLoading(true);

    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully!", userCredential.user);
      
      // Show success and clear inputs
      setSuccess("Account created successfully!");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("Firebase Signup Error:", err.code, err.message);
      // Clean up common Firebase error messages
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please log in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email format.");
      } else {
        setError(err.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-brand-950">Create an Account</h2>
      
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 text-green-700 text-sm">{success}</div>}

      <form onSubmit={handleSignup} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1 text-gray-700">Password (Min 6 chars)</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow" 
            required 
            minLength={6}
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-800 text-white py-3 rounded-lg hover:bg-brand-900 transition-colors flex justify-center disabled:bg-brand-400 mt-6 font-medium shadow-sm"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <button onClick={onToggleMode} className="text-brand-600 font-semibold hover:underline">
          Log In
        </button>
      </div>
    </div>
  );
}
