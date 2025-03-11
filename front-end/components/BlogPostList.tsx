"use client";

import { useRouter } from "next/navigation";



type BlogPostListProps = {
  posts: any;
  loading: boolean;
};

const BlogPostList = ({ posts, loading }: BlogPostListProps) => {
  const router = useRouter();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!posts?.length) {
    return <div className="text-center py-8">No posts found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {posts.map((post:any) => {
        const excerpt = post.content
          ? post.content.replace(/<[^>]+>/g, "").substring(0, 100) + "..."
          : "No content available.";

        return (
          <div
            key={post.id}
            className="bg-neutral-50 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {/* Blog Image */}
            <div className="relative">
              <img
                src={post.image || "https://via.placeholder.com/300x150?text=No+Image"}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            {/* Blog Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {post.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Category: <span className="font-medium">{post.category}</span>
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag:string[], index:any) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {excerpt}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                By: <span className="font-medium">{post.author.username}</span>
              </p>

              {/* Read More Button */}
              <button
                onClick={() => router.push(`/blog/${post.id}`)}
                className="mt-4 px-6 py-2 bg-stone-950 text-white rounded-lg hover:text-stone-900 hover:bg-neutral-100 transition-all"
              >
                Read More
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogPostList;
