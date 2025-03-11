"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deletepostbyId, getAllPosts, updateStadusById } from "@/lib/blogs/_requests";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { BASE_URL } from "@/core/_consts";
import { QUERIES } from "@/lib/blogs/_consts";

const Page = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts({ search, status, page });

      if (response?.data && response?.meta) {
        setPosts(response.data);
        setTotalPages(response.meta.totalPages);
      } else {
        setPosts([]); // Ensure posts is never undefined
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      setLoading(true);
      const response :any = await deletepostbyId(id);
      if (response?.meta?.success) {
        toast({
          description: `${response?.meta?.message}`,
          className:
            "bg-green-100 text-green-800 border border-green-600 dark:bg-green-800 dark:text-white dark:border-green-600",
        });
        getData();
      } else {
        toast({
          description: response?.meta?.message || "Something went wrong",
          className:
            "bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePostStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === "published" ? "draft" : "published";
      const response = await updateStadusById(id, newStatus)

      if (response.data) {
        toast({
          description: `${response?.meta?.message}`,
          className:
            "bg-green-100 text-green-800 border border-green-600 dark:bg-green-800 dark:text-white dark:border-green-600",
        });
        getData(); // Refresh the data
      } else {
        toast({
          description: "Failed to update post status",
          className:
            "bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600",
        });
      }
    } catch (error) {
      console.error("Error toggling post status:", error);
      toast({
        description: "Something went wrong",
        className:
          "bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600",
      });
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    getData();
  }, [search, status, page]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Input
          type="search"
          placeholder="Search..."
          className="w-64"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <Link href="/dashboard/new-post">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : posts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No blog found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts?.map((post:{
                  _id:string,
                  title:string,
                  author:{
                    username:string
                  },
                  createdAt:Date,
                  status:string
                  
                }) => (
                  <TableRow key={post?._id}>
                    <TableCell className="font-medium">{post?.title}</TableCell>
                    <TableCell>{post?.author?.username}</TableCell>
                    <TableCell>
                      {new Date(post?.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          post?.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post?.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/edit-post/${post?._id}`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePost(post?._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            togglePostStatus(post?._id, post?.status)
                          }
                        >
                          Toggle Status
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex justify-between mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;