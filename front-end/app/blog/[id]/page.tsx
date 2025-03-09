"use client";
import Comments from "@/components/Comments";
import { getPostById } from "@/lib/blogs/_requests";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Blog = () => {
  const params = useParams();
  const postId: string = params.id as string; // Ensure postId is typed as string
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    tags: [] as string[], // Initialize tags as an array of strings
    image: "",
  });

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
        });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Blog Image */}
        <img
          src={post.image || "https://via.placeholder.com/800x400?text=No+Image"} // Fallback image
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />

        {/* Blog Title */}
        <h1 className="text-4xl md:text-5xl font-bold mt-8 text-gray-900 dark:text-white">
          {post.title}
        </h1>

        {/* Blog Category */}
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Category: <span className="font-semibold">{post.category}</span>
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Blog Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>

        {/* Tags Section */}
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="my-8">
        <Comments postId={postId} /> {/* Pass the current post ID */}
      </div>
    </div>
  );
};

export default Blog;