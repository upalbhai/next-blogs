'use client';

import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FiLogOut } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { google, logout } from '@/core/_requests';

export const Oath = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false); // New state to track Firebase auth initialization
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Signed in user:', result.user?.displayName);

      const obj = {
        name: result.user?.displayName || 'Unknown User',
        email: result.user?.email || 'No email',
        profilePicture: result.user?.photoURL || '',
      };

      const response:any = await google(obj);
      console.log(response);

      if (response?.meta?.success) {
        const responseString = JSON.stringify(response?.data);

// Step 2: Store the string in local storage
localStorage.setItem("userinfo", responseString);

        toast({
          description: `${response?.meta?.message}`,
          className:
            'bg-green-100 text-green-800 border border-green-600 dark:bg-green-800 dark:text-white dark:border-green-600',
        });
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      toast({
        description: 'Error during Google sign-in.',
        className:
          'bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const response = await logout();
      
      if (response.meta.success) {
        await signOut(auth);
        localStorage.removeItem("userinfo");
        setUser(null);
  
        console.log("User signed out successfully");
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
  

  // Show a loading state until Firebase auth is initialized
  if (!authInitialized) {
    return <div>Loading...</div>; // Or a spinner/loading component
  }

  return (
    <div className="flex items-center">
      {user ? (
        <div className="flex items-center space-x-4">
          <DropdownMenu>
      {/* Avatar as Dropdown Trigger */}
      <DropdownMenuTrigger asChild>
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="User Avatar"
          className="w-9 h-9 rounded-full border-2 border-gray-600 cursor-pointer"
        />
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
          {/* Dialog Trigger Button */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <div
                onClick={() => setOpenDialog(true)}
                className="p-2 rounded-full bg-gray-700 hover:bg-red-500 transition cursor-pointer"
              >
                <FiLogOut className="text-white text-xl" />
              </div>
            </DialogTrigger>

            {/* Dialog Content */}
            <DialogContent className="max-w-[90vw] sm:max-w-md w-full sm:mx-auto rounded-lg">
              <DialogTitle className="text-lg font-semibold text-center">
                Confirm Logout
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 text-center mt-2">
                Are you sure you want to log out? This action cannot be undone.
              </DialogDescription>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 w-full sm:w-auto rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpenDialog(false);
                  }}
                  className="px-4 py-2 w-full sm:w-auto rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      )}
    </div>
  );
};