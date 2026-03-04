"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CreateBlog() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isAiBlogs: false,
    excerpt: "",
    coverImage: null,
    coverImagePrompt: "",
    authorName: "",
    category: "",
    categorySlug: "",
    categoryId: "",
    subCategory: "",
    subCategorySlug: "",
    subCategoryId: "",
    tags: "",
    seoMetaTitle: "",
    seoMetaDescription: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [error, setError] = useState("");
  const { data: session, status, update } = useSession();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!session?.backendToken) return;

      const res = await fetch("/api/categories");
      const data = await res.json();

      setCategories(data.categories || []);
      setSubCategories(data.subCategories || []);
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      coverImage: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;

    // Filter subcategories for this category
    const filtered = subCategories.filter(
      (sub) => sub.categoryId === selectedCategoryId,
    );

    setFilteredSubCategories(filtered);

    setFormData((prev) => ({
      ...prev,
      categoryId: selectedCategoryId,
      subCategoryId: "", // reset subcategory
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateAI = async () => {
    if (!formData.title) {
      toast.error("Please enter title first");
      return;
    }

    setAiLoading(true);

    const res = await axios.post(
      "http://localhost:7000/api/user/generate-ai-blog",
      {
        title: formData.title,
        categoryId: formData.categoryId,
      },
      {
        headers: {
          Authorization: `Bearer ${session.backendToken}`,
        },

      },
    );

    const data = res.data;
    setAiLoading(false);
    if (res.status !== 200) {
      isAiBlogs = true;
      toast.error(res.error);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      content: data?.content,
      excerpt: data?.excerpt,
      coverImagePrompt: data?.coverImagePrompt,
      seoMetaTitle: data?.seoMetaTitle,
      tags: data?.tags,
      seoMetaDescription: data?.seoMetaDescription,
    }));
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      subCategoryId: selectedSubId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("content", JSON.stringify(formData.content));
      data.append("excerpt", formData.excerpt);
      data.append("isAiBlogs", formData.isAiBlogs)

      data.append("categoryId", formData.categoryId);
      data.append("subCategoryId", formData.subCategoryId);

      data.append("categorySlug", slugify(formData.category));
      data.append("subCategorySlug", slugify(formData.subCategory));

      data.append(
        "tags",
        JSON.stringify(formData.tags.split(",").map((t) => t.trim()))
      );

      data.append("seoMetaTitle", formData.seoMetaTitle);
      data.append("seoMetaDescription", formData.seoMetaDescription);
      data.append("coverImagePrompt", formData.coverImagePrompt);

      if (formData.coverImage) {
        data.append("coverImage", formData.coverImage);
      }

      if (formData.published) {
        data.append("publishedAt", new Date().toISOString());
      }

      const res = await fetch("http://localhost:7000/api/blogs/public", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to publish blog");
      }

      toast.success("Successfuly Publish Blogs");
    } catch (err: any) {
      toast.error("Oops something went wrong");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          <h1 className="font-heading text-3xl font-bold mb-2 text-center text-gray-900">
            Share Your Knowledge
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Contribute to the community with your insights.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE */}
            <div>
              <label className="text-black block text-sm font-semibold mb-2">
                Title
              </label>
              <input
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Enter blog title"
              />
            </div>

            {/* EXCERPT */}
            <div>
              <label className="text-black block text-sm font-semibold mb-2">
                Excerpt (Short Description)
              </label>
              <textarea
                name="excerpt"
                maxLength={300}
                value={formData.excerpt}
                onChange={handleChange}
                className="input"
                placeholder="Short blog summary (max 300 chars)"
              />
            </div>

            {/* CATEGORY + SUBCATEGORY */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-black block text-sm font-semibold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-black block text-sm font-semibold mb-2">
                  Sub Category
                </label>
                <select
                  name="subCategoryId"
                  value={formData.subCategoryId}
                  onChange={handleSubCategoryChange}
                  className="input"
                  disabled={!filteredSubCategories.length}
                >
                  {filteredSubCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AUTHOR */}
            <div>
              <label className="text-black block text-sm font-semibold mb-2">
                Author
              </label>
              <input
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                className="input"
                placeholder="Anonymous"
              />
            </div>

            {/* COVER IMAGE */}
            <div>
              <label className="text-black block text-sm font-semibold mb-2">
                Cover Image
              </label>

              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleImageChange}
                className="input"
              />

              <label htmlFor="coverUpload">
                {preview ? (
                  <img
                    src={preview}
                    onClick={() => setShowPreview(true)}
                    className="w-20 h-20 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                    +
                  </div>
                )}
              </label>
            </div>
            {/* TAGS */}
            <div>
              <label className="text-black block text-sm font-semibold mb-2">
                Cover Image Prompt
              </label>
              <input
                name="coverImagePrompt"
                value={formData.coverImagePrompt}
                onChange={handleChange}
                className="input"
                placeholder="marketing, seo, ai"
              />
            </div>

            {/* TAGS */}
            <div>
              <label className="text-black block text-sm font-semibold mb-2">
                Tags
              </label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="marketing, seo, ai"
              />
            </div>

            {/* CONTENT */}
            <div className="">
              <div>
                <label className="text-black block text-sm font-semibold mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  required
                  rows={10}
                  value={formData.content}
                  onChange={handleChange}
                  className="input"
                  placeholder="Write blog content..."
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="px-4 py-2 text-black rounded-lg hover:text-green transition"
              >
                {aiLoading ? "Generating..." : "✨ Write with AI"}
              </button>
            </div>

            {/* SEO SECTION */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-black text-lg">SEO Settings</h3>

              <input
                name="seoMetaTitle"
                value={formData.seoMetaTitle}
                onChange={handleChange}
                className="input"
                placeholder="SEO Meta Title (60 chars)"
                maxLength={60}
              />

              <textarea
                name="seoMetaDescription"
                value={formData.seoMetaDescription}
                onChange={handleChange}
                className="input"
                placeholder="SEO Meta Description (160 chars)"
                maxLength={160}
              />
            </div>

            {/* PUBLISH TOGGLE */}
            <div className="text-black flex items-center gap-3">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
              />
              <label>Publish Immediately</label>
            </div>

            <Button type="submit" disabled={loading || aiLoading} className="w-full">
              {loading ? "Publishing..." : "Publish Blog"}
            </Button>
          </form>
        </motion.div>
        {showPreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setShowPreview(false)}
          >
            <img
              src={preview!}
              alt="Full Preview"
              className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
            />
          </div>
        )}
      </div>
    </main>
  );
}
