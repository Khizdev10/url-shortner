"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc" // Colored Google icon
// OR
import { FaGoogle } from "react-icons/fa" // Simple Google icon

export default function LoginWithGoogle() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="w-full border border-gray-300 py-3 rounded-lg bg-white hover:bg-gray-50 transition mt-4 flex items-center justify-center gap-3 font-semibold text-gray-700"
    >
      <FcGoogle size={20} />
      Continue with Google
    </button>
  );
}
