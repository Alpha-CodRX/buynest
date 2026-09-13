 
"use client";

import { Suspense, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // const response = await axios.post(
      //   "http://localhost:5000/api/v1/auth/login",
      //   {
      //     email,
      //     password,
      //   }
      // );

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      /* =========================
         SAVE JWT TOKEN
      ========================= */

      const token = response.data.token;

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);

      /* =========================
         GET LOGGED IN USER
      ========================= */

      const user =
        response.data.user ||
        response.data.data?.user ||
        response.data.data;

      console.log("Logged In User:", user);

      /* =========================
         SAVE USER
      ========================= */

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      /* =========================
         REDIRECT
      ========================= */

      const redirect =
        searchParams.get("redirect");

      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/admin");
      }

    } catch (error) {
      console.error("Login Error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Invalid email or password"
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">

        {/* =========================
            HEADER
        ========================= */}

        <h1 className="mb-2 text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-6 text-gray-500">
          Login to your BuyNest account
        </p>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            LOGIN FORM
        ========================= */}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* Email */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2"
            />
          </div>

          {/* Password */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2"
            />
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* =========================
            SIGNUP
        ========================= */}

        <p className="mt-6 text-center text-sm text-gray-500">

          Dont have an account?{" "}

          <button
            type="button"
            onClick={() =>
              router.push("/signup")
            }
            className="font-medium text-black hover:underline"
          >
            Sign Up
          </button>

        </p>

      </div>
    </div>
  );
  
} 

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}