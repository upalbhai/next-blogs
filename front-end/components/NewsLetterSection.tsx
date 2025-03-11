"use client";
import { subscription } from "@/core/_requests";
import { toast } from "@/hooks/use-toast";
import { useState, FormEvent } from "react";

export const SubscriptionBox = () => {
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
    <>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center items-center">
  <input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="px-6 py-3 rounded-lg w-full md:w-96 lg:w-1/2 xl:w-1/3 focus:outline-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
    aria-label="Email address"
  />
  <button
    type="submit"
    className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
  >
    Subscribe
  </button>
</form>

      {/* Success/Error Message */}
      {message && (
        <p className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-300">{message}</p>
      )}
    </>
  );
};

const NewsletterSection = () => {
  return (
    <div className="py-12 bg-gradient-to-r from-zinc-100 to-slate-50 dark:bg-gradient-to-r dark:from-slate-900 dark:to-stone-950">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl dark:text-gray-100 font-bold text-neutral-900 mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-950 dark:text-gray-300 mb-6">
          Get the latest updates, exclusive content, and more delivered straight to your inbox.
        </p>

        <SubscriptionBox />
      </div>
    </div>
  );
};

export default NewsletterSection;