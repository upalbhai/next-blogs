import mongoose from 'mongoose';
import { Blog } from '../models/blogModel.js';
import User from '../models/userModel.js';


export const createBlog = async (req, res, next) => {
    try {
      const { title, content, tags ,category,image} = req.body;
  
      // Extract authorId from the authenticated user
      const authorId = req.user?.id; // Use optional chaining to avoid errors when user is not defined
      // Create the blog post
      const newBlog = new Blog({
        title,
        content,
        category,
        author: authorId,
        tags,
        image
      });
  
      // Save the blog post to the database
      const savedBlog = await newBlog.save();
  
      // Return success response with the saved blog data
      return res.status(201).json({
        meta: {
          success: true,
          message: "Blog created successfully",
        },
        data: savedBlog,
        error: null,
      });
    } catch (error) {
      // Handle errors and pass them to the error-handling middleware
      return res.status(500).json({
        meta: {
          success: false,
          message: "An error occurred while creating the blog",
        },
        data: null,
        error: error.message || "Internal Server Error",
      });
    }
  };

  
  export const getAllPost = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "", sort = "desc", status = "published" } = req.query;
  
      // Constructing the query based on provided filters
      let query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { tags: { $elemMatch: { $regex: search, $options: "i" } } }, // Updated for array of strings
        ],
      };
  
      // If status is provided, add it to the query
      if (status && status !== "all") {
        query.status = status;
      }
  
      const blogs = await Blog.find(query)
        .populate("author", "username")
        .sort({ createdAt: sort === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalBlogs = await Blog.countDocuments(query);
  
      return res.status(200).json({
        meta: {
          success: true,
          message: "Blogs retrieved successfully",
          totalPages: Math.ceil(totalBlogs / limit),
          currentPage: Number(page),
          totalBlogs,
        },
        data: blogs,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({
        meta: {
          success: false,
          message: "Failed to fetch blogs",
        },
        error: error.message,
      });
    }
  };
  export const getAllPostForUsers = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        sort = "desc",
      } = req.query;
  
      // Constructing the query based on provided filters
      let query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { tags: { $elemMatch: { $regex: search, $options: "i" } } }, // Updated for array of strings
        ],
        status: "published", // Ensure only published posts are fetched initially
      };

  
      const blogs = await Blog.find(query)
        .populate("author", "username")
        .sort({ createdAt: sort === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalBlogs = await Blog.countDocuments(query);
  
      return res.status(200).json({
        meta: {
          success: true,
          message: "Blogs retrieved successfully",
          totalPages: Math.ceil(totalBlogs / limit),
          currentPage: Number(page),
          totalBlogs,
        },
        data: blogs,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({
        meta: {
          success: false,
          message: "Failed to fetch blogs",
        },
        error: error.message,
      });
    }
  };
  
  export const getPostById = async(req,res)=>{
    try {
      const { id } = req.params;
      console.log('id',id)
      const blog = await Blog.findById(id).populate("author", "username");
      console.log('blog',blog)
      if (!blog) {
        return res.status(404).json({
          meta: {
            success: false,
            message: "Blog not found",
          }
        })
      }
      // if(blog.author._id!==userId){
      //   return res.status(403).json({
      //     meta: {
      //       success: false,
      //       message: "You are not authorized to view this blog",
      //     }
      //   })
      // }
      return res.status(200).json({
        meta: {
          success: true,
          message: "Blog retrieved successfully",
        },
        data:blog
      })
    } catch (error) {
      return res.status(500).json({
        meta: {
          success: false,
          message: "Failed to fetch blog",
        },
        error: error.message,
      });
    }
  }

  export const editPost = async (req, res) => {
    try {
      const { id } = req.params; // Extract post ID from URL
      const { title, content, image, tags, category } = req.body;
  
      // Find the post first before updating
      const post = await Blog.findById(id).populate("author", "username");
  
      if (!post) {
        return res.status(404).json({
          meta: {
            success: false,
            message: "Post not found",
          },
          data: null,
          error: "No post found with the given ID",
        });
      }
  
      // Check if the logged-in user is the author
      if (post.author._id.toString() !== req.user.id) {
        return res.status(403).json({
          meta: {
            success: false,
            message: "You are not authorized to update this blog",
          },
        });
      }
  
      // Now update the post after authorization check
      const updatedPost = await Blog.findByIdAndUpdate(
        id,
        { title, content, tags, image, category },
        { new: true, runValidators: true } // Return updated document & apply validation
      );
  
      return res.status(200).json({
        meta: {
          success: true,
          message: "Post updated successfully",
        },
        data: updatedPost,
        error: null,
      });
  
    } catch (error) {
      return res.status(500).json({
        meta: {
          success: false,
          message: "An error occurred while updating the post",
        },
        data: null,
        error: error.message || "Internal Server Error",
      });
    }
  };
  


export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find post first without deleting it
    const post = await Blog.findById(id).populate("author", "username");

    if (!post) {
      return res.status(404).json({
        meta: {
          success: false,
          message: "Post not found",
        },
      });
    }

    // Check if the logged-in user is the author
    if (post.author._id.toString() !== req.user.id) {
      return res.status(403).json({
        meta: {
          success: false,
          message: "You are not authorized to delete this blog",
        },
      });
    }

    // Now delete the post after authorization check
    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      meta: {
        success: true,
        message: "Post deleted successfully",
      },
    });
  } catch (error) {
    return res.status(500).json({
      meta: {
        success: false,
        message: "An error occurred while deleting the post",
      },
      data: null,
      error: error.message || "Internal Server Error",
    });
  }
};



  export const updateStatus = async(req,res)=>{
    if (req.method !== "PUT") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const { id } = req.params; // Get the blog post ID from the URL
    const { status } = req.body; // Get the new status from the request body
  
    // Validate the status
    if (status !== "published" && status !== "draft") {
      return res.status(400).json({meta:{
         message: "Invalid status",
         success:false
      } });
    }
  
    try {
      // Connect to the database  
      // Find the blog post by ID
      const blog = await Blog.findById(id).populate("author","username");;
  
      if (!blog) {
        return res.status(404).json({ meta:{
          message: "Blog post not found",
          success: false
        } });
      }
      if(blog.author._id!=req.user.id){
        return res.status(403).json({
          meta: {
            success: false,
            message: "You are not authorized to update this blog",
          }
        })
      }
  
      // Update the blog status
      blog.status = status;
      await blog.save();
  
      // Return the updated blog post
      res.status(200).json({ meta:{
        message: "Blog status updated",
        success: true
      },data: blog });
    } catch (error) {
      console.error(error);
      res.status(500).json({meta:{
        message: "Error while updating the post",
        success:false
      },
        data: null,
      error: error.message || "Internal Server Error",
       });
    }
  }