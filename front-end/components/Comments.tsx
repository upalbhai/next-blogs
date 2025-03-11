"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { createComment, deleteComment, getComments } from "@/lib/comments/_requests";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Import your modal/dialog component
import { toast } from "@/hooks/use-toast";

interface Comment {
  _id: string;
  content: string;
  authorId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  parentCommentId: string | null;
  replies: Comment[];
}

const Comments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState(""); // State for comment content
  const [parentCommentId, setParentCommentId] = useState<string | null>(null); // State for reply parent ID
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false); // State for reply modal
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null); // State for the comment being replied to
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({}); // Track visible replies for each comment
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDataString = localStorage.getItem("userinfo");
      setUser(userDataString ? JSON.parse(userDataString) : null);
    }
  }, []);
  

  // Fetch comments for the post
  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getComments(postId, page);
      if (response.meta.success) {
        // Filter out replies (comments with a parentCommentId)
        const topLevelComments = response.data.filter(
          (comment:any) => !comment.parentCommentId
        );
        if (page === 1) {
          setComments(topLevelComments); // Replace comments for the first page
        } else {
          setComments((prev) => [...prev, ...topLevelComments]); // Append new comments for subsequent pages
        }
        setTotalPages(response.meta.totalPages);
      } else {
        setError(response.meta.message);
      }
    } catch (err) {
      setError("Failed to fetch comments");
      console.error("ERROR GETTING COMMENTS", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Handle comment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const response = await createComment({
        content,
        authorId: user.user._id, // Replace with actual user ID from auth context
        blogId: postId,
        parentCommentId: parentCommentId || "",
      });

      if (response.meta.success) {
        setContent(""); // Clear the input
        setParentCommentId(null); // Reset parent comment ID
        setIsReplyModalOpen(false); // Close the reply modal
        fetchComments(1); // Refresh the comments (start from page 1)
      }
    } catch (err) {
      setError("Failed to create comment");
    }
  };

  // Handle "Reply" button click
  const handleReplyClick = (comment: Comment) => {
    setReplyingTo(comment); // Set the comment being replied to
    setParentCommentId(comment._id); // Set the parent comment ID
    setIsReplyModalOpen(true); // Open the reply modal
  };

  // Handle "View More Comments" button click
  const handleViewMore = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      setPage(nextPage);
      fetchComments(nextPage);
    }
  };

  // Handle "Show Replies" button click
  const toggleReplies = (commentId: string) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle visibility of replies
    }));
  };

  const handleDeleteComment = async(id:string)=>{
    try {
        const response = await deleteComment(id);
    if(response?.meta?.success){
        fetchComments();
        toast({
            description: `${response?.meta?.message}`,
            className:
              'bg-green-100 text-green-800 border border-green-600 dark:bg-green-800 dark:text-white dark:border-green-600',
          });
    }
    } catch (error) {
        console.error('Error during Deleting comment:', error);
      toast({
        description: 'Error during Deleting comment:',
        className:
          'bg-red-100 text-red-800 border border-red-600 dark:bg-red-800 dark:text-white dark:border-red-600',
      });   
    }
  }

  // Render a single comment (recursive for replies)
  const renderComment = (comment: Comment) => (
    <div key={comment._id} className="mb-4 pl-4 border-l-2 border-gray-200">
      <div className="flex items-start space-x-3">
        <Avatar>
          <AvatarImage src={comment.authorId.profilePicture} />
          <AvatarFallback>{comment.authorId.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold">{comment.authorId.username}</div>
          <div className="text-sm text-gray-500">
            {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
          </div>
          <p className="mt-1">{comment.content}</p>
          <Button
            variant="link"
            size="sm"
            onClick={() => handleReplyClick(comment)} // Open reply modal
          >
            Reply
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => handleDeleteComment(comment?._id)} // Open reply modal
          >
            Delete
          </Button>
          {/* Show Replies Button */}
          {comment.replies?.length > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => toggleReplies(comment._id)} // Toggle replies visibility
            >
              {visibleReplies[comment._id] ? "Hide Replies" : "Show Replies"}
            </Button>
          )}
        </div>
      </div>
      {/* Render replies if visible */}
      {visibleReplies[comment._id] &&
        comment.replies?.map((reply) => (
          <div key={reply._id} className="ml-8 mt-4">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage src={reply.authorId.profilePicture} />
                <AvatarFallback>{reply.authorId.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">{reply.authorId.username}</div>
                <div className="text-sm text-gray-500">
                  {format(new Date(reply.createdAt), "MMM d, yyyy h:mm a")}
                </div>
                <p className="mt-1">{reply.content}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full mb-2"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit">Post Comment</Button>
      </form>

      {/* Loading State */}
      {loading && <p>Loading comments...</p>}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => renderComment(comment))
      )}

      {/* View More Comments Button */}
      {page < totalPages && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleViewMore} disabled={loading}>
            View More Comments
          </Button>
        </div>
      )}

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reply to {replyingTo?.authorId.username}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full mb-4"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReplyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Post Reply</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comments;