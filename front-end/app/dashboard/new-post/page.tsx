"use client";
import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import TitleAndTagsInput from "@/components/TitleAndTagsInput";
import { createPosts } from "@/lib/blogs/_requests";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const TextEditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("<p>Start writing your blog post...</p>");
  const [values, setValues] = useState({
    title: "",
    category: "",
    tags: [],
  });
  const { theme } = useTheme(); // Get the current theme from next-themes

  const { toast } = useToast();
  const router = useRouter();

  const config = {
    theme: theme === "dark" ? "dark" : "light",
    placeholder: "",
    toolbarSticky: false,
    height: 400,
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "image",
      "link",
      "|",
      "align",
      "fontsize",
      "brush",
      "|",
      "undo",
      "redo",
      "source",
    ],
    style: {
      background: theme === "dark" ? "#1f2937" : "#ffffff", // Dark or light background
      color: theme === "dark" ? "#e5e7eb" : "#000000", // Light or dark text color
      border: theme === "dark" ? "1px solid #374151" : "1px solid #cccccc",
      caretColor: theme === "dark" ? "#ffffff" : "#000000", // White or black cursor
    },
  };

  // Save Content Function
  const handleSaveContent = async () => {
    try {
      let reqObj = {
        title: values.title || "",
        content: content,
        tags: values.tags || [],
        category: values.category || "",
      };

      const response = await createPosts(reqObj);
      console.log(response, "rrr");

      if (response?.meta?.success) {
        toast({
          description: `${response?.meta?.message}`,
          className:
            "bg-green-100 text-green-800 border border-green-600 dark:bg-green-800 dark:text-white dark:border-green-600",
        });

        // Navigate to /dashboard/posts after success
        router.push("/dashboard/posts");
      } else {
        toast({
          description: response?.meta?.message || "Something went wrong",
          className:
            "bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600",
        });
        throw new Error(response?.meta?.message || "Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        description:
          error instanceof Error
            ? error.response?.data.meta?.message
            : "Something went wrong",
        className:
          "bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800">
      {/* Title and Tags Input */}
      <TitleAndTagsInput values={values} setValues={setValues} />

      {/* Jodit Editor */}
      <div className="dark:bg-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg">
        <JoditEditor ref={editor} value={content} config={config} onBlur={(newContent) => setContent(newContent)} />
      </div>

      {/* Save Button */}
      <div className="mt-4">
        <Button onClick={handleSaveContent}>Save Post</Button>
      </div>
    </div>
  );
};

export default TextEditor;
