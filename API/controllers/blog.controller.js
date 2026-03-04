const Blog = require("../models/Blog.js");
const Users = require("../models/Users.js");
const Category = require("../models/Mstd_Category");
const SubCategory = require("../models/Mstd_sub_category.js");
const path = require("path");
const slugify = require("slugify");
const {
  sendMailConfirmation,
  sendMailToUserThatBlogsIsLive,
} = require("../utils/sendmails.js");
const { randomUUID } = require("crypto");

exports.createPublicBlog = async (req, res) => {
  try {
    const userId = req?.userId;

    const {
      title,
      content,
      excerpt,
      categoryId,
      subCategoryId,
      categorySlug,
      subCategorySlug,
      tags,
      seoMetaTitle,
      seoMetaDescription,
      coverImagePrompt,
      publishedAt,
      isAiBlogs,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    const approvalToken = randomUUID();

    const user = await Users.findById(userId);
    const category = await Category.findById(categoryId);
    const subCategory = await SubCategory.findById(subCategoryId);

    const parsedContent = content ? JSON.parse(content) : null;
    const parsedTags = tags ? JSON.parse(tags) : [];

    const uniqueSlug = `${slugify(title, { lower: true })}-${Date.now()}`;

    let coverImage = null;

    if (req.uniqueKeyCoverImg) {
      coverImage = path.join(
        process.env.DOCPATH,
        userId,
        "Image",
        req.uniqueKeyCoverImg,
      );
    }

    const blog = await Blog.create({
      title,
      slug: uniqueSlug,
      userId,
      content: parsedContent,
      excerpt,
      categoryId,
      subCategoryId,
      isAiBlogs,
      categorySlug,
      subCategorySlug,
      tags: parsedTags,
      coverImage,
      coverImagePrompt,
      seoMetaTitle,
      seoMetaDescription,
      published: false,
      approvalToken,
      approvalTokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 36),
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    });

    await sendMailConfirmation({
      title,
      content:
        typeof parsedContent === "string"
          ? parsedContent
          : JSON.stringify(parsedContent),
      categoryId: category?.name,
      subCategoryId: subCategory?.name,
      userName: user?.name,
      blogId: String(blog?._id),
      approvalToken,
      approvalTokenExpires,
    });

    return res.status(201).json({
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("createPublicBlog error:", error);

    return res.status(500).json({
      message: error.message || "Failed to create blog",
    });
  }
};

exports.approveBlog = async (req, res) => {
  try {
    const { token } = req.body;

    const blog = await Blog.findOne({
      approvalToken: token,
      approvalTokenExpires: { $gt: new Date() },
    });

    const user = await Users.findById(blog?.userId);

    if (!blog) {
      return res.status(400).json({
        message: "Invalid or expired approval link",
      });
    }

    blog.published = true;
    blog.publishedAt = new Date();
    blog.approvalToken = null;

    await blog.save();

    return res.json({
      message: "Blog published successfully",
    });

    await sendMailToUserThatBlogsIsLive({
      email: user?.email,
      name: user?.name,
      title: blog?.title,
      slug: blog?.slug,
    });
  } catch (error) {
    console.error("approveBlog error:", error);

    return res.status(500).json({
      message: "Approval failed",
    });
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
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
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
    console.log("error: ", error);
  }
};

exports.getSubCatgMasters = async (req, res) => {
  try {
    const categories = await SubCategory.find({}).lean();
    res.json(categories);
  } catch (error) {
    console.log("error: ", error);
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
