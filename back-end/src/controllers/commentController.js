import { Comment } from "../models/commentModel.js";
import mongoose from "mongoose";


export const createComment = async (req, res) => {
    try {
      const { blogId,  content, parentCommentId } = req.body;
      const authorId = req.user.id;
      // Validate required fields
      if (!blogId || !authorId || !content) {
        return res.status(400).json({
          meta: {
            success: false,
            message: "blogId, authorId, and content are required",
          },
          error: "Missing required fields",
        });
      }
  
      // Validate blogId and authorId as valid ObjectIds
      if (
        !mongoose.Types.ObjectId.isValid(blogId) ||
        !mongoose.Types.ObjectId.isValid(authorId)
      ) {
        return res.status(400).json({
          meta: {
            success: false,
            message: "Invalid blogId or authorId",
          },
          error: "Invalid ObjectId",
        });
      }
  
      // If parentCommentId is provided, validate it
      if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
        return res.status(400).json({
          meta: {
            success: false,
            message: "Invalid parentCommentId",
          },
          error: "Invalid ObjectId",
        });
      }
  
      // Create the new comment
      const newComment = new Comment({
        blogId,
        authorId,
        content,
        parentCommentId: parentCommentId || null, // Set to null if not provided
      });
  
      // Save the new comment to the database
      await newComment.save();
  
      // If this is a reply, update the parent comment's replies array
      if (parentCommentId) {
        await Comment.findByIdAndUpdate(parentCommentId, {
          $push: { replies: newComment._id }, // Add the new comment's ID to the parent's replies array
        });
      }
  
      // Return the created comment
      return res.status(201).json({
        meta: {
          success: true,
          message: "Comment created successfully",
        },
        data: newComment,
        error: null,
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({
        meta: {
          success: false,
          message: "Failed to create comment",
        },
        error: error.message,
      });
    }
  };

  export const getComments = async (req, res) => {
    try {
      const {  page = 1, limit = 10 } = req.query;
        const {blogId} = req.params;
      // Validate blogId
      if (!blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
          meta: {
            success: false,
            message: "Valid blogId is required",
          },
          error: "Invalid blogId",
        });
      }
  
      // Convert page and limit to numbers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      // Calculate the number of documents to skip
      const skip = (pageNumber - 1) * limitNumber;
  
      // Fetch comments with pagination
      const comments = await Comment.find({ blogId })
        .populate("authorId", "username profilePicture") // Populate author details
        .populate({
          path: "replies",
          populate: { path: "authorId", select: "username profilePicture" }, // Populate reply authors
        })
        .sort({ createdAt: -1 }) // Sort by latest first
        .skip(skip)
        .limit(limitNumber);
  
      // Count total comments for the blog
      const totalComments = await Comment.countDocuments({ blogId });
  
      // Return the response
      return res.status(200).json({
        meta: {
          success: true,
          message: "Comments fetched successfully",
          totalComments,
          totalPages: Math.ceil(totalComments / limitNumber),
          currentPage: pageNumber,
        },
        data: comments,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({
        meta: {
          success: false,
          message: "Failed to fetch comments",
        },
        error: error.message,
      });
    }
  };

  export const updateComment = async (req, res) => {
    try {
      const { id } = req.params; // Comment ID
      const { content } = req.body; // Updated content
  
      // Validate comment ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          meta: {
            success: false,
            message: "Valid comment ID is required",
          },
          error: "Invalid comment ID",
        });
      }
  
      // Validate content
      if (!content || typeof content !== "string") {
        return res.status(400).json({
          meta: {
            success: false,
            message: "Content is required and must be a string",
          },
          error: "Invalid content",
        });
      }
  
      // Find and update the comment
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { content, updatedAt: new Date() }, // Update content and set updatedAt
        { new: true } // Return the updated document
      ).populate("authorId", "username avatar"); // Populate author details
  
      if (!updatedComment) {
        return res.status(404).json({
          meta: {
            success: false,
            message: "Comment not found",
          },
          error: "Comment not found",
        });
      }
  
      // Return the updated comment
      return res.status(200).json({
        meta: {
          success: true,
          message: "Comment updated successfully",
        },
        data: updatedComment,
        error: null,
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      return res.status(500).json({
        meta: {
          success: false,
          message: "Failed to update comment",
        },
        error: error.message,
      });
    }
  };

export const deleteComment = async (req, res) => {
    try {
      const { id } = req.params; // Comment ID
  
      // Validate comment ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          meta: {
            success: false,
            message: "Valid comment ID is required",
          },
          error: "Invalid comment ID",
        });
      }
  
      // Find the comment
      const comment = await Comment.findById(id);
  
      if (!comment) {
        return res.status(404).json({
          meta: {
            success: false,
            message: "Comment not found",
          },
          error: "Comment not found",
        });
      }
  
      // Cascade delete: Delete the comment and all its replies
      await Comment.deleteMany({
        $or: [
          { _id: id }, // Delete the comment itself
          { parentCommentId: id }, // Delete all replies to the comment
        ],
      });
  
      // Return success response
      return res.status(200).json({
        meta: {
          success: true,
          message: "Comment and its replies deleted successfully",
        },
        data: null,
        error: null,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({
        meta: {
          success: false,
          message: "Failed to delete comment",
        },
        error: error.message,
      });
    }
  };