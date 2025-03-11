import mongoose, { Schema, model } from "mongoose";


  
  const BlogSchema = new Schema(
    {
      title: { type: String, required: true },
      category: { type: String, required: true },
      content: { type: String, required: true },
      author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
      comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Array of Comment references
      image: { type:String }, // Array of Comment references
      tags: [{ type: String }],
      featured: { type: Boolean, default: false },
      likes: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date },
      status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'draft',
      }
      
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt
  );
  
  export const Blog = model("Blog", BlogSchema);