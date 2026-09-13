 
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

export default function AdminNavbar() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const getUser = () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return;
      }

      try {
        const parsedUser: unknown = JSON.parse(storedUser);

        if (
          parsedUser !== null &&
          typeof parsedUser === "object"
        ) {
          setUser(parsedUser as UserData);
        } else {
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error(
          "Invalid user data:",
          error
        );

        localStorage.removeItem("user");
      }
    };

    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      {/* Left */}
      <div>
        <h2 className="text-lg font-semibold">
          Admin Panel
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* User Information */}
        <div className="flex items-center gap-3">

          {/* User Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
            <User size={20} />
          </div>

          {/* Name + Role */}
          <div className="hidden sm:block">
            <p className="text-sm font-medium">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs capitalize text-gray-500">
              {user?.role || ""}
            </p>
          </div>

        </div>

        {/* Logout */}
        {/* <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={17} />

          <span>Logout</span>
        </button> */}

      </div>

    </header>
  );
} 
