"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import api from "@/lib/axios";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);

  const [user, setUser] = useState<UserData | null>(null);

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  const [search, setSearch] = useState("");

  const navLinks = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Shop",
      href: "/products",
    },
  ];

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");

      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        setUser(null);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to parse user:", error);

        setUser(null);
      }
    };

    checkUser();

    // Listen for login/logout changes
    window.addEventListener("storage", checkUser);
    window.addEventListener("auth-change", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("auth-change", checkUser);
    };
  }, []);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = () => {
    const value = search.trim();

    if (!value) return;

    router.push(`/search?q=${encodeURIComponent(value)}`);

    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.dispatchEvent(new Event("auth-change"));

    setMobileMenuOpen(false);

    router.replace("/login");
  };

  // ==========================================
  // STICKY HEADER
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ==========================================
  // PREVENT BODY SCROLL
  // ==========================================

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ==========================================
          HEADER
      ========================================== */}

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isSticky ? "bg-white/90 shadow-md backdrop-blur" : "bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* ======================================
              LEFT
          ====================================== */}

          <div className="flex items-center gap-2">
            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
              aria-label="Open Menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}

            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-header.png"
                alt="BuyNest Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </Link>

            {/* Desktop Navigation */}

            <nav className="hidden items-center gap-4 px-8 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition ${
                    pathname === link.href
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.title}
                </Link>
              ))}

              {/* Categories */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen((previous) => !previous)}
                  className="flex items-center gap-1 font-medium text-gray-700 transition hover:text-blue-600"
                >
                  Categories
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      categoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {categoryOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border bg-white p-2 shadow-xl">
                    {categories.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-500">
                        Loading categories...
                      </p>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products?category=${category._id}`}
                          onClick={() => setCategoryOpen(false)}
                          className={`block rounded-lg px-4 py-3 text-sm transition ${
                            pathname === `/category/${category.slug}`
                              ? "bg-blue-50 font-semibold text-blue-600"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {category.name}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* ======================================
              DESKTOP SEARCH
          ====================================== */}

          <div className="relative hidden flex-1 lg:mx-6 lg:block">
            <button
              type="button"
              onClick={handleSearch}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <input
              type="search"
              autoComplete="off"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search for products..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ======================================
              RIGHT
          ====================================== */}

          <div className="flex items-center gap-1">
            {/* Login / Logout */}

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100 lg:flex"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-gray-100 lg:flex"
              >
                <User className="h-5 w-5" />
                Login
              </Link>
            )}

            {/* Mobile Search */}

            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
              aria-label="Open Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}

            <div className="relative">
              <Link
                href="/cart"
                className="block rounded-lg p-2 transition hover:bg-gray-100"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />

                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          MOBILE SEARCH
      ========================================== */}

      {mobileSearchOpen && (
        <div className="border-b bg-white p-4 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="rounded-lg p-2 transition hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex-1">
              <button
                type="button"
                onClick={handleSearch}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-500"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <input
                type="search"
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MOBILE MENU
      ========================================== */}

      {mobileMenuOpen && (
        <>
          {/* Overlay */}

          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Drawer */}

          <div className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl">
            {/* Drawer Header */}

            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-2xl font-bold text-blue-600">BuyNest</h2>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}

            <nav className="space-y-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-4 py-3 font-medium transition ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            {/* Mobile Categories */}

            <div className="border-t p-4">
              <button
                type="button"
                onClick={() => setMobileCategoryOpen((previous) => !previous)}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-semibold transition hover:bg-gray-100"
              >
                <span>Categories</span>

                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileCategoryOpen && (
                <div className="mt-2 space-y-1 pl-2">
                  {categories.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      Loading categories...
                    </p>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/category/${category.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block rounded-lg px-4 py-3 text-sm transition ${
                          pathname === `/category/${category.slug}`
                            ? "bg-blue-50 font-semibold text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Mobile Login / Logout */}

            <div className="border-t p-4">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
