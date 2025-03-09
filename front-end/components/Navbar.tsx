"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaBell, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { ModeToggle } from "./ModeToggle";
import { Oath } from "./Oath";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Get search params from the URL

  // Extract the search query from the URL
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query); // Sync the search bar with the URL query
  }, [searchParams]);

  // Hide navbar if the user is on any /dashboard route
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = encodeURIComponent(searchQuery);
    const url = `/blogs?search=${query}`;

    // Prefetch the page to ensure client-side navigation
    router.prefetch(url);

    // Navigate with shallow routing to prevent a full reload
    router.push(url, { scroll: false });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      {/* Mobile: Logo, Search, and Toggle Button in One Line */}
      <div className="flex items-center justify-between p-4 md:hidden">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800 dark:text-white">Logo</div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center flex-1 mx-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600"
        >
          <span className="absolute left-3 text-gray-500 dark:text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-3 py-2 bg-transparent w-full focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </form>

        {/* Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="text-gray-700 dark:text-gray-300 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop: Full Navbar */}
      <div className="hidden md:flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800 dark:text-white">Logo</div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          {["Home", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="px-4 py-2 rounded-3xl dark:bg-slate-900 bg-zinc-50 hover:shadow-md transition-shadow text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-64 bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600"
        >
          <span className="absolute left-3 text-gray-500 dark:text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-3 py-2 bg-transparent w-full focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </form>

        {/* Icons & Theme Toggle */}
        <div className="flex items-center space-x-6">
          <FaBell className="w-6 h-6 text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white" />
          <ModeToggle />
          <Oath />
        </div>
      </div>

      {/* Mobile: Dropdown Menu */}
      <div
        className={`${isMenuOpen ? "flex" : "hidden"} flex-col md:hidden items-center w-full bg-white dark:bg-gray-800 py-4 space-y-4`}
      >
        {["Home", "About", "Contact"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {item}
          </Link>
        ))}

        {/* Icons & Theme Toggle */}
        <div className="flex space-x-6">
          <FaBell className="w-6 h-6 text-gray-700 dark:text-gray-300 cursor-pointer" />
          <ModeToggle />
          <Oath />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;