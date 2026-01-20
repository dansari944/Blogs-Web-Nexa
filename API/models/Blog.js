const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    slug: { type: String, unique: true, index: true },

    // Supports editor like Quill / TipTap / EditorJS
    content: { type: Object, required: true },

    excerpt: { type: String, maxlength: 300 },

    coverImage: String,

    category: {
      type: String,
      index: true,
    },

    tags: [{ type: String, index: true }],

    seo: {
      metaTitle: { type: String, maxlength: 60 },
      metaDescription: { type: String, maxlength: 160 },
    },

    published: { type: Boolean, default: false },

    publishedAt: Date,

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔍 Full-text search (title + excerpt)
BlogSchema.index({
  title: "text",
  excerpt: "text",
  tags: "text",
});

module.exports = mongoose.model("Blog", BlogSchema);
