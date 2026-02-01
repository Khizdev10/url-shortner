"use client";

import { signIn } from "next-auth/react";

export default function LoginWithGoogle() {
  return (
    <button
      type="button"
      onClick={() => signIn("google",{callbackUrl:"/dashboard"})}
      className="w-full border py-2 rounded bg-gray-400"
    >
      Continue with Google
    </button>
  );
}
