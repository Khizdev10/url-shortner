"use client";
import { signIn } from "next-auth/react"
import { useState } from "react";
import LoginWithGoogle from "./loginWithGoogle";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");


  const login = async () => {
    alert("User logged In")

    let email = document.getElementById("email") as HTMLInputElement;
    let password = document.getElementById("password") as HTMLInputElement;
    const result = await signIn("credentials", {
      email: email.value,
      password: password.value,
      redirect: false, // Don't auto-redirect
    });

    if (result?.error) {
      alert("Login failed!");
    } else {
      alert("Login successful!");
      window.location.href = "/dashboard"; // Redirect manually
    }

    // let res = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ email: email.value, password: password.value })
    // })
    // let data = await res.json();
    // console.log(data);
  }

  const signup = async () => {
    alert("User Signed Up")
    let email = document.getElementById("email") as HTMLInputElement;
    let password = document.getElementById("password") as HTMLInputElement;
    let name = document.getElementById("name") as HTMLInputElement;
    let res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email.value, password: password.value, name: name.value })
    })
    let data = await res.json();
    console.log(data);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />

      {/* Wave */}
      <svg
        className="absolute bottom-[-1] left-0 w-full"
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="white"
          d="M0,120 C120,160 240,80 360,90 480,100 600,160 720,150 840,140 960,60 1080,70 1200,80 1320,140 1440,120 L1440,200 L0,200 Z"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center text-white">

          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-bold mb-4">
              {mode === "login" ? "Welcome Back 👋" : "Join Shortify 🚀"}
            </h1>
            <p className="opacity-80 mb-2">
              {mode === "login"
                ? "Login to manage your links, analytics, and dashboard."
                : "Create an account to manage branded links and track clicks."}
            </p>
            <p className="opacity-70">
              Fast, secure, and beautifully simple URL shortening.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white text-black rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-1">
              {mode === "login" ? "Login" : "Create Account"}
            </h2>
            <p className="text-sm opacity-60 mb-6">
              {mode === "login"
                ? "Enter your credentials to continue"
                : "Sign up in seconds — it's free"}
            </p>

            <div className="space-y-4">
              {mode === "signup" && (
                <input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              <input
                type="email"
                id="email"
                placeholder="Email address"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {mode === "signup" && (
                <input
                  type="password"
                  id="password2"
                  placeholder="Confirm password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              <button onClick={(mode === "login" ? login : signup)} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition">
                {mode === "login" ? "Login" : "Sign Up"}
              </button>
            </div>

            <LoginWithGoogle />

            {/* Switch */}
            <div className="mt-6 text-sm text-center">
              {mode === "login" ? (
                <p>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
