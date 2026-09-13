 
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  LogOut,
} from "lucide-react";

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "user"],
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
    roles: ["admin"],
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    roles: ["admin"],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    roles: ["admin", "user"],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] =
    useState<UserData | null>(null);

  /* =====================================================
     GET LOGGED-IN USER
  ===================================================== */

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: unknown =
        JSON.parse(storedUser);

      if (
        parsedUser &&
        typeof parsedUser === "object"
      ) {
        const userData =
          parsedUser as UserData;

        setUser(userData);

        console.log(
          "Logged in user:",
          userData
        );
      }
    } catch (error) {
      console.error(
        "Failed to parse user:",
        error
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      router.replace("/login");
    }
  }, [router]);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  /* =====================================================
     ROLE
  ===================================================== */

  const role = user?.role;

  const isAdmin = role === "admin";

  /* =====================================================
     FILTER MENU BY ROLE
  ===================================================== */

  const visibleMenuItems =
    menuItems.filter((item) =>
      item.roles.includes(role || "")
    );

  /* =====================================================
     SIDEBAR
  ===================================================== */

  return (
    <aside className="flex min-h-full w-64 shrink-0 flex-col border-r bg-white">
      {/* =================================================
          LOGO
      ================================================= */}

      <div className="border-b p-6">
        <h1 className="text-2xl font-bold">
          BuyNest
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {isAdmin
            ? "Admin"
            : user?.name || "User"}
        </p>
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

       
    </aside>
  );
} 