"use client"
import { subscription } from "@/core/_requests";
import { toast } from "@/hooks/use-toast";
import { useState, FormEvent } from "react";

const Footer = () => {

    const [email, setEmail] = useState<string>("");
      const [message, setMessage] = useState<string>(""); // To display success/error messages
    
      const subscribe = async () => {
        if (!email) {
          setMessage("Please enter a valid email.");
          return;
        }
    
        try {
          const response = await subscription(email);
          if (response?.meta?.success) {
            setMessage("Successfully subscribed!");
            toast({
              description: `${response?.meta?.message}`,
              className:
                "bg-green-100 text-green-800 border border-green-600 dark:bg-green-800 dark:text-white dark:border-green-600",
            });
            setEmail(""); // Clear input field after success
          } else {
            setMessage("Subscription failed. Try again.");
          }
        } catch (error: any) {
          toast({
            description: error?.response?.data?.meta?.message || "Something went wrong. Please try again.",
            className:
              "bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600",
          });
          setMessage("Error subscribing. Please try later.");
        }
      };
    
      const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        subscribe();
      };
    
    return (
      <footer className="dark:bg-gray-900 bg-stone-50 dark:text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              We are a team of passionate writers sharing insightful stories and ideas.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Facebook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <form  onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Your Blog Name. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;