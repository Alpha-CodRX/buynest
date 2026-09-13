"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer/Footer";

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // --------------------------------
      // No login
      // --------------------------------
      if (!token || !storedUser) {
        router.replace("/login");
        return;
      }

      try {
        const parsedUser: unknown = JSON.parse(storedUser);

        // --------------------------------
        // Validate user data
        // --------------------------------
        if (
          parsedUser &&
          typeof parsedUser === "object"
        ) {
          const user = parsedUser as UserData;

          console.log("Logged in user:", user);
          console.log("User role:", user.role);

          // User is logged in
          setChecking(false);
        } else {
          // Invalid user
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          router.replace("/login");
        }
      } catch (error) {
        console.error("Invalid user data:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.replace("/login");
      }
    };

    checkLogin();
  }, [router]);

  // --------------------------------
  // Checking login
  // --------------------------------
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Checking login...
        </p>
      </div>
    );
  }

  // --------------------------------
  // Logged-in user
  // Admin OR normal user
  // --------------------------------
  return (
    <>
    <div className="flex min-h-screen bg-gray-100">

      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">

        {/* Top Navbar */}
        <AdminNavbar />

        <Toaster />

        <div className="p-8">
          {children}
        </div>

      </main>


    </div>
    
<Footer />
</>
  );
}