"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import api from "@/lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Users
  // =========================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/users");

        console.log("Users Response:", response.data);

        const responseData = response.data;

        // Backend returns:
        // {
        //   success: true,
        //   count: number,
        //   users: [...]
        // }

        if (!Array.isArray(responseData.users)) {
          console.error(
            "Users is not an array:",
            responseData
          );

          throw new Error(
            "Invalid users response"
          );
        }

        // Show only normal customers
        const customerUsers = responseData.users.filter(
          (user: User) => user.role === "user"
        );

        setUsers(customerUsers);
      } catch (error) {
        console.error("Users Error:", error);

        if (axios.isAxiosError(error)) {
          console.log(
            "Status:",
            error.response?.status
          );

          console.log(
            "Backend Response:",
            error.response?.data
          );
        }

        setError("Failed to load users");
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // =========================
  // Delete User
  // =========================
  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/admin/users/${userId}`
      );

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );

      toast.success(
        "User deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete User Error:",
        error
      );

      if (axios.isAxiosError(error)) {
        console.log(
          "Status:",
          error.response?.status
        );

        console.log(
          "Backend Response:",
          error.response?.data
        );
      }

      toast.error(
        "Failed to delete user"
      );
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          Users
        </h1>

        <p className="mt-4 text-gray-500">
          Loading users...
        </p>
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          Users
        </h1>

        <p className="mt-4 text-red-500">
          {error}
        </p>
      </div>
    );
  }

  // =========================
  // Page
  // =========================
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Users
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage registered customers
        </p>
      </div>

      {/* User Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Total Customers:{" "}
          <span className="font-semibold text-gray-900">
            {users.length}
          </span>
        </p>
      </div>

      {/* Empty State */}
      {users.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            No customers found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full min-w-[700px]">
            {/* Table Header */}
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Joined
                </th>

               
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {user.name}
                    </p>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                   
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}