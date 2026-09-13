"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LoginUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Admin Login Response:", response.data);

      const token = response.data.token;

      if (!token) {
        throw new Error("Token not received");
      }

      // Get user from API response
      const user: LoginUser | null =
        response.data.user ||
        response.data.data?.user ||
        response.data.data ||
        null;

      console.log("Logged In User:", user);

      // Check admin role
      if (user?.role !== "admin") {
        setError("Access denied. Admin account required.");
        toast.error("Only admin can access this page.");

        return;
      }

      // Save token
      localStorage.setItem("token", token);

      // Save admin user
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      toast.success("Admin login successful");

      // Go to admin dashboard
      router.push("/admin");

    } catch (error) {
      console.error("Admin Login Error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Invalid admin credentials"
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }

      toast.error("Admin login failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-gray-500">
            Login to BuyNest Admin Panel
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter admin email"
              required
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
              placeholder="Enter admin password"
              required
              className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2"
            />
          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login as Admin"}
          </button>

        </form>

        {/* Back to normal login */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
            className="text-sm font-medium text-gray-600 hover:text-black hover:underline"
          >
            Login as User
          </button>
        </div>

      </div>

    </div>
  );
}