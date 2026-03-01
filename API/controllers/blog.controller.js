const Blog = require("../models/Blog.js");
const Category = require("../models/Mstd_Category");
const SubCategory = require("../models/Mstd_sub_category.js");

exports.createPublicBlog = async (req, res) => {
  try {
    const { title, content, category, authorName } = req.body;

    // Auto-generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const uniqueSlug = `${slug}-${Date.now()}`;

    const blog = await Blog.create({
      title,
      content,
      category,
      authorName: authorName || "Anonymous",
      slug: uniqueSlug,
      published: true, // Automatically publish for now, or set to false for moderation
      publishedAt: new Date(),
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    const query = { published: true };

    if (category) {
      query.category = category;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, published: true });
  if (!blog) return res.status(404).json({ message: "Not found" });

  blog.views++;
  await blog.save();
  res.json(blog);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

exports.getBlogsByCategorySlug = async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });

  if (!category) {
    return res.json([]);
  }

  const blogs = await Blog.find({
    categoryId: category._id,
  }).sort({ createdAt: -1 });

  res.json(blogs);
};

exports.getBlogMasters = async (req, res) => {
  try {
    const categories = await Category.find({}).lean();
    return res.json(categories);
  } catch (error) {
    console.log('error: ', error);

  }
};

exports.getSubCatgMasters = async (req, res) => {
  try {
    const categories = await SubCategory.find({}).lean();
    res.json(categories);
  } catch (error) {
    console.log('error: ', error);

  }
};

exports.getBlogsByCategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = 5; // blogs per load
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({
      categorySlug: category,
      subCategorySlug: subcategory,
      status: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch blogs",
    });
  }
};