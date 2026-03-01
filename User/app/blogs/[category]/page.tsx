"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [masters, setMasters] = useState<any[]>([]);
  const [subMasterArr, setSubMastersArr] = useState<any[]>([]);
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<any | null>(null);

  useEffect(() => {
    async function loadMasters() {
      try {
        // CATEGORY MASTER
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/blogs/blog-masters`,
        );
        const data = await res.json();
        setMasters(data);

        // SUB CATEGORY MASTER
        const subCatRes = await fetch(
          `${process.env.NEXT_PUBLIC_API}/blogs/sub-cat-masters`,
        );
        const newData = await subCatRes.json();
        setSubMastersArr(newData);
      } catch (err) {
        console.error("Failed to load masters", err);
      }
    }

    loadMasters();
  }, []);

  const getSubCategories = (catId: string) => {
    return subMasterArr.filter((sub: any) => sub.categoryId === catId);
  };

  const categoryName = params.category.replace(/-/g, " ");

  return (
    <>
      <main
        className="min-h-screen bg-gray-50 pb-20"
        style={{ paddingTop: "var(--nav-height)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 capitalize">
              {categoryName}
            </h1>
          </div>

          {/* CATEGORY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {masters.map((cat: any) => (
              <div
                key={cat._id}
                onClick={() => setActiveCategory(cat)}
                className="
                p-6 border-black text-black rounded-xl shadow
                hover:scale-[1.03] hover:shadow-2xl
                transition duration-300 cursor-pointer
              "
              >
                <h2 className="text-xl font-bold mb-3">{cat.name}</h2>
                <p className="text-gray-600">{cat.description}</p>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className="
    group
    relative
    inline-flex items-center gap-3
    px-6 py-3
    mt-3
    rounded-full
    bg-white text-black
    font-semibold tracking-wide
    shadow-md
    overflow-hidden
    transition-all duration-300
    hover:bg-black hover:text-white
    hover:shadow-xl
  "
                >
                  <span className="relative z-10">Explore Blogs</span>

                  {/* Arrow */}
                  <span
                    className="
      relative z-10
      transition-all duration-300
      group-hover:translate-x-2
      group-hover:scale-125
    "
                  >
                    →
                  </span>

                  {/* Hover Background Effect */}
                  <span
                    className="
      absolute inset-0
      bg-black
      scale-x-0
      origin-left
      transition-transform duration-300
      group-hover:scale-x-100
      rounded-full
    "
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ===== GLOBAL MODAL OVERLAY ===== */}
      {activeCategory && (
        <div
          className="
          fixed inset-0
          z-[9999]
          flex items-center justify-center
          bg-black/70 backdrop-blur-lg
        "
          onClick={() => setActiveCategory(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
            relative
            bg-white
            rounded-2xl
            w-[90%] max-w-2xl
            p-8
            shadow-2xl
            scale-100
            transition-all duration-300
          "
          >
            {/* CLOSE */}
            <button
              onClick={() => setActiveCategory(null)}
              className="absolute top-4 right-4 text-2xl font-bold hover:scale-110 transition"
            >
              ✕
            </button>

            <h2 className="text-2xl text-gray-600 font-black mb-2">{activeCategory.name}</h2>

            <p className="text-gray-600 mb-6">{activeCategory.description}</p>

            {/* SUB CATEGORIES */}
            <div className="grid grid-cols-2 gap-4">
              {getSubCategories(activeCategory._id).map((sub: any) => (
                <Link
                  key={sub._id}
                  href={`/blogs/${activeCategory.slug}/${sub.slug}`}
                  className="
                  p-3 rounded-lg border text-gray-600
                  hover:bg-blue-500
                  transition cursor-pointer
                "
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
