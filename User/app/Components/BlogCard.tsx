"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AccessTime, Person } from "@mui/icons-material";

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  slug: string;
  image?: string;
}

export default function BlogCard({
  title,
  excerpt,
  category,
  author,
  date,
  slug,
  image,
}: BlogCardProps) {
  return (
    <Link href={`/blogs/${slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="card-shadow bg-white rounded-xl overflow-hidden h-full flex flex-col border border-gray-100"
      >
        <div className="h-48 overflow-hidden bg-gray-100 relative group">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
               <span className="text-4xl">📝</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-secondary text-white shadow-sm">
              {category}
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <Person style={{ fontSize: 16 }} className="text-secondary" />
              <span className="font-medium">{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <AccessTime style={{ fontSize: 16 }} />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
