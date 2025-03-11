"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const userDataString = typeof window !== "undefined" ? localStorage.getItem("userinfo") : null;
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (user && userData?.user?.isAdmin) {
        setIsAuthenticated(true);
      } else {
        router.replace("/"); // Use `replace` to avoid back navigation
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : null;
};

export default PrivateRoute;
