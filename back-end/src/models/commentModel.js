import mongoose, { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true }, // Reference to the blog post
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who wrote the comment
    content: { type: String, required: true }, // The comment content
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // Reference to the parent comment (for replies)
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Array of child replies
    createdAt: { type: Date, default: Date.now }, // Timestamp when the comment was created
    updatedAt: { type: Date }, // Timestamp when the comment was last updated
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

export const Comment = model("Comment", CommentSchema);