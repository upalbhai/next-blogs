"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import BlogPostList from "@/components/BlogPostList";
import { getAllPostsUSers } from "@/lib/blogs/_requests";

interface Post {
  _id: string;
  title: string;
  category: string;
  content: string;
  author: { _id: string; username: string };
  tags: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const observer = useRef<IntersectionObserver | null>(null);

  // Reset posts and page when searchQuery changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  // Fetch posts when searchQuery or page changes
  useEffect(() => {
    const fetchPosts = async () => {
      if (!hasMore || loading) return; // Prevent multiple API calls

      try {
        setLoading(true);
        const response = await getAllPostsUSers({ search: searchQuery, page });

        if (response?.data) {
          setPosts((prev) => {
            // Avoid duplicate posts by checking _id
            const newPosts = response.data.filter(
              (post:any) => !prev.some((p) => p._id === post._id)
            );
            return [...prev, ...newPosts];
          });

          setTotalPages(response.meta.totalPages);
          setHasMore(page < response.meta.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchQuery, page, hasMore, loading]);

  // Infinite Scroll Observer
  const lastPostRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || !hasMore) return;

      // Disconnect the previous observer
      if (observer.current) observer.current.disconnect();

      // Create a new observer
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 1.0 } // Trigger when the entire element is visible
      );

      // Observe the last post element
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Blog Posts</h1>
      <BlogPostList posts={posts} loading={loading} />

      {/* Infinite Scroll Trigger */}
      {hasMore && <div ref={lastPostRef} className="h-10"></div>}

      {/* Loading Indicator */}
      {loading && <div className="text-center py-4">Loading more posts...</div>}

      {/* No More Posts */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">No more posts to load.</div>
      )}
    </div>
  );
};

export default BlogPage;