import mongoose, { Schema, models } from "mongoose";

const Post = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    coverImage: { type: String },
    tags: [{ type: String }],
    category: { type: String },
    author: { type: String },
    isPublished: { type: Boolean, default: false },
    readTime: { type: Number },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Post || mongoose.model("Post", Post);
