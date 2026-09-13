"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  Clock,
} from "lucide-react";

import api from "@/lib/axios";
import StatCard from "./StatCard";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/dashboard");

        console.log("Dashboard Response:", response.data);

        setStats(response.data.data);
      } catch (error) {
        console.error("Dashboard Error:", error);

        if (axios.isAxiosError(error)) {
          console.log("Status:", error.response?.status);
          console.log("Response:", error.response?.data);
        }

        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-red-500">
          {error}
        </p>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your BuyNest store
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Total Products"
          value={stats?.totalProducts ?? 0}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={<ShoppingCart size={22} />}
        />

        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue ?? 0}`}
          icon={<IndianRupee size={22} />}
        />

        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          icon={<Clock size={22} />}
        />
      </div>
    </div>
  );
}