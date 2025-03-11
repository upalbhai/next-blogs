"use client"; // Required for client-side hooks

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { editPost, getPostById } from "@/lib/blogs/_requests"; // Import updatePost function
import dynamic from "next/dynamic";
import TitleAndTagsInput from "@/components/TitleAndTagsInput";
import { useTheme } from "next-themes"; // Import useTheme from next-themes
import { toast } from "@/hooks/use-toast";
import FeaturePostEdit from "@/components/FeaturePostEdit";
import { Button } from "@/components/ui/button";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditPost = () => {
  const editor = useRef(null);
  const params = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const postId= params.id;
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    tags: [""],
    image:"",
    featured:false
  });
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false); // Loading state for API request
  const { theme } = useTheme(); // Get the current theme from next-themes

  // Fetch post data
  const fetchPost = async () => {
    try {
      const response = await getPostById(postId);
      if (response.meta.success) {
        setPost({
          title: response.data.title,
          category: response.data.category,
          content: response.data.content,
          tags: response.data.tags,
          image: response.data.image,
          featured: response.data.featured
        });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // Handle post update
  const updatePost = async () => {
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);

    try {
      const response = await editPost(postId, post); // Call the updatePost API
      if (response.meta.success) {
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
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamically adjust Jodit editor config based on the current theme
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


  return (
    <div className={`max-w-3xl mx-auto p-4 border rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-300"}`}>
      <h1 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Edit Post</h1>
      <Button onClick={() => setIsDialogOpen(true)}>
  {post?.featured ? "Unfeature" : "Feature"} Post
</Button>
      <FeaturePostEdit
        postId={postId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        featured={post?.featured}
        fetchPost={fetchPost}
      />
      <TitleAndTagsInput values={post} setValues={setPost} isEdit={true} />

      {/* Jodit Editor */}
      <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>Content</label>
      <div className={`${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"} border rounded-lg`}>
        <JoditEditor
          ref={editor}
          value={post.content}
          config={config}
          onBlur={(newContent) => setPost({ ...post, content: newContent })} // Use onChange instead of onBlur
        />
      </div>

      {/* Update Button */}
      <button
        onClick={updatePost}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isLoading ? "Updating..." : "Update Post"}
      </button>
    </div>
  );
};

export default EditPost;