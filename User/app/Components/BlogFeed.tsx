"use client";

import { useEffect, useState } from "react";
import FeedPost from "./FeedPost";

export default function BlogFeed({
  category,
  subcategory,
}: {
  category: string;
  subcategory: string;
}) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  /* ================= FETCH ================= */
  const fetchBlogs = async () => {
    if (!hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/blogs/${category}/${subcategory}?page=${page}`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setBlogs((prev) => [...prev, ...data]);
        setPage((p) => p + 1);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* INITIAL LOAD */
  useEffect(() => {
    fetchBlogs();
  }, []);

  /* INFINITE SCROLL */
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400
      ) {
        fetchBlogs();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore]);

  /* ================= UI ================= */
  return (
    <section className="max-w-3xl mx-auto px-4 space-y-10">

      {/* LOADING */}
      {loading && blogs.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          Loading stories...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && blogs.length === 0 && (
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold mb-3">
            🚀 Nothing here yet
          </h2>
          <p className="text-gray-600">
            Wait until someone generates the data and shares their story.
          </p>
        </div>
      )}

      {/* FEED */}
      {blogs.map((blog) => (
        <FeedPost key={blog._id} blog={blog} />
      ))}

      {/* LOAD MORE */}
      {loading && blogs.length > 0 && (
        <p className="text-center text-gray-400">
          Loading more stories...
        </p>
      )}
    </section>
  );
}