"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";
import { toast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logout } from "@/core/_requests";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLogout = async (): Promise<void> => {
    try {
      const response = await logout();
      
      if (response.meta.success) {
        await signOut(auth);
        
        if (typeof window !== "undefined") {
          localStorage.removeItem("userinfo");
        }
  
        toast({
          description: `${response?.meta?.message}`,
          className:
            "bg-green-100 text-green-800 border border-green-600 dark:bg-green-800 dark:text-white dark:border-green-600",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Unsuccessful",
        description: "Something went wrong.",
        className:
          "bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex overflow-x-hidden">
      {/* Backdrop for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 lg:relative lg:w-64 bg-white dark:bg-gray-800 shadow-lg p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-50 min-h-screen overflow-y-auto`}
      >
        {/* Close Button for Mobile */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Blog Dashboard
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/posts"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5 mr-3" />
                <span>Posts</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <Separator className="my-6" />
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <ModeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Children Content */}
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;