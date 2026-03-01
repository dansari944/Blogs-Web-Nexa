const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: String, required: true, ref: "User" },
    slug: { type: String, unique: true, index: true },
    content: { type: Object, required: true },
    excerpt: { type: String, maxlength: 300 },
    coverImage: { type: String },
    authorName: { type: String, default: "Anonymous" },
    category: { type: String, required: true, },
    categorySlug: { type: String, required: true, },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: String, index: true },
    subCategorySlug: { type: String, index: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    tags: [{ type: String, index: true }],
    seoMetaTitle: { type: String, maxlength: 60 },
    seoMetaDescription: { type: String, maxlength: 160 },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);