"use client";

import Link from "next/link";

export default function FeedPost({ blog }: any) {
  return (
    <article
      className="
        bg-white rounded-2xl overflow-hidden
        shadow-sm hover:shadow-lg
        transition duration-300
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 p-5">
        <div className="w-10 h-10 rounded-full bg-gray-200" />

        <div>
          <p className="font-semibold">
            {blog.authorName || "ChatterBuzz"}
          </p>
          <p className="text-sm text-gray-500">
            {blog.category}
          </p>
        </div>
      </div>

      {/* IMAGE */}
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-[380px] object-cover"
        />
      )}

      {/* CONTENT */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3">
          {blog.title}
        </h2>

        <p className="text-gray-600 line-clamp-3 mb-4">
          {blog.excerpt}
        </p>

        <Link
          href={`/blog/${blog.slug}`}
          className="font-semibold text-indigo-600 hover:underline"
        >
          Read Story →
        </Link>
      </div>
    </article>
  );
}