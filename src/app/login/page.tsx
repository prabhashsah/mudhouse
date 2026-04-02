"use client";

import { useState } from "react";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-950">
          The Mud House Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Authorized personnel only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
        <div className="px-4 py-8 sm:px-10">
          {isLoginMode ? (
            <Login onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <Signup onToggleMode={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
