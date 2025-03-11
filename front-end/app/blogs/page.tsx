"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BlogPostList from "@/components/BlogPostList";
import { getAllPostsUSers } from "@/lib/blogs/_requests";

const BlogPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPage />
    </Suspense>
  );
};

interface Post {
  id: string;
  title: string;
  category: string;
  content: string;
  author: { id: string; username: string };
  tags: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}


const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]); // ✅ Correctly typed state
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!hasMore || loading) return;

      try {
        setLoading(true);
        const response = await getAllPostsUSers({ search: searchQuery, page });

        if (response?.data) {
          setPosts((prev) => {
            const newPosts = response.data
              .filter((post: any) => !prev.some((p) => p.id === post._id))
              .map((post: any) => ({
                ...post,
                id: post._id,
                author: { id: post.author?._id, username: post.author?.username },
              }));

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

  const lastPostRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 1.0 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Blog Posts</h1>
      <BlogPostList posts={posts} loading={loading} />

      {hasMore && <div ref={lastPostRef} className="h-10"></div>}
      {loading && <div className="text-center py-4">Loading more posts...</div>}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">No more posts to load.</div>
      )}
    </div>
  );
};

export default BlogPageWrapper;
