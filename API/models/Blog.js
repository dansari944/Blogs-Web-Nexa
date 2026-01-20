const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    content: Object,
    excerpt: String,
    coverImage: String,
    category: String,
    tags: [String],
    seo: {
      metaTitle: String,
      metaDescription: String
    },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
