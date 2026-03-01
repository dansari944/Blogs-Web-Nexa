"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowForward } from "@mui/icons-material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BlogCard from "./components/BlogCard";
import Button from "./components/Button";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("http://localhost:7000/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setRecentBlogs(data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* <section className="relative pb-20 md:pb-32 overflow-hidden"> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900 leading-tight">
              Crafting the Future of <br />
              <span className="text-primary">Digital Innovation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your source for expert insights on Mobile Tech, AI, Science, and
              Machine Learning. Join a community of forward-thinkers.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/blogs/create">
                <Button className="flex items-center space-x-2 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                  <span>Start Writing</span>
                  <ArrowForward />
                </Button>
              </Link>
              <Link href="/blogs/global-world">
                <Button variant="outline" className="px-8 py-4 text-lg">
                  Explore Topics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="who-we-are" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
              Global Stories. Future Ideas.
            </h2>

            <div className="w-20 h-1 bg-secondary mb-8 rounded-full"></div>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              ChatterBuzz is a modern media and blogging platform dedicated to
              sharing the latest worldwide stories shaping our future. From
              breakthroughs in Artificial Intelligence and emerging technologies
              to science, innovation, and digital culture — we bring ideas that
              matter to a global audience.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Our mission is to simplify complex innovations through powerful
              storytelling. We explore how technology transforms industries,
              societies, and everyday life — delivering insights, trends, and
              perspectives that inspire curiosity and forward thinking.
            </p>
          </div>

          <div className="md:w-1/2">
            <div className="aspect-video bg-gray-100 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
              <span className="text-6xl">🌍</span>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
            We Open Doors. We Serve. We Specialize.
          </h2>

          <div className="w-20 h-1 bg-secondary mb-8 rounded-full"></div>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            ChatterBuzz is a multicultural and diverse platform powered by
            engineers, creatives, storytellers, and technology enthusiasts
            dedicated to shaping the future of global storytelling. We combine
            innovation, creativity, and data-informed decision making to
            transform ideas into meaningful digital experiences.
          </p>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            For the first time in India, we are building a space where anyone
            can generate blogs from what’s in their mind — turning thoughts into
            stories that reach people across borders. From AI, science, and
            technology to culture and human innovation, we help voices connect
            with the world through out-of-the-box storytelling.
          </p>

          <p className="text-lg text-gray-600 leading-relaxed">
            Our mission is simple: empower people to express ideas freely,
            connect communities globally, and create something different — a
            platform where creativity meets technology and stories travel beyond
            boundaries.
          </p>
        </div>

        <div className="md:w-1/2">
          <div
            className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 
                  rounded-2xl shadow-lg border border-gray-200 
                  flex flex-col items-center justify-center 
                  text-center p-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 uppercase">
              Tell Your Story
            </h3>

            <p className="text-lg text-gray-600 mb-6 max-w-md leading-relaxed">
              Inspire others with your ideas, connect with people across the
              world, and discover stories that shape our future.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold uppercase">
                Post a story
              </span>

              <span className="px-4 py-2 border border-gray-300 rounded-full text-sm uppercase font-semibold text-gray-700">
                Read Global Stories
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <section id="case-studies" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
              Our Case Studies
            </h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4">
              See how we've helped businesses transform and grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded-xl mb-6 overflow-hidden">
                <div className="w-full h-full bg-gray-300 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                Tech Giant Rebrand
              </h3>
              <p className="text-gray-600">
                Complete visual identity overhaul and website migration for a
                Fortune 500 company.
              </p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded-xl mb-6 overflow-hidden">
                <div className="w-full h-full bg-gray-300 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                E-commerce Growth
              </h3>
              <p className="text-gray-600">
                200% increase in organic traffic and 50% boost in conversion
                rate via SEO.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
            Industries We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Healthcare",
              "Real Estate",
              "Technology",
              "Education",
              "Finance",
              "Manufacturing",
              "Retail",
            ].map((ind) => (
              <span
                key={ind}
                className="px-6 py-3/10 backdrop-blur-sm rounded-full font-semibold border border-white/20 hover:bg-white hover:text-primary transition-all cursor-default"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
              Plans & Packages
            </h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Starter", "Growth", "Enterprise"].map((plan) => (
              <div
                key={plan}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col relative overflow-hidden"
              >
                {plan === "Growth" && (
                  <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan}</h3>
                <div className="text-4xl font-extrabold mb-6 text-primary">
                  {plan === "Enterprise" ? "Custom" : "$999"}
                  <span className="text-base font-normal text-gray-500">
                    {plan !== "Enterprise" && "/mo"}
                  </span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span> {plan}{" "}
                    Strategy
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span> Monthly
                    Reports
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span> Dedicated
                    Support
                  </li>
                </ul>
                <Button
                  className="w-full py-3"
                  variant={plan === "Growth" ? "primary" : "outline"}
                >
                  Choose {plan}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Insights Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Latest Resources
            </h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Stay ahead of the curve with our most recent articles and deep
              dives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog: any) => (
                <BlogCard
                  key={blog._id}
                  title={blog.title}
                  excerpt={blog.excerpt || "No excerpt available."}
                  category={blog.category}
                  author={blog.authorName || "Anonymous"}
                  date={blog.createdAt}
                  slug={blog.slug}
                  image={blog.coverImage || ""}
                />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-10 rounded-xl shadow-sm border border-gray-100">
                <p className="text-lg">
                  No blogs found. Be the first to write one!
                </p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link href="/blogs/global-world">
              <Button variant="secondary" className="px-8">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
            Our Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Orlando, FL", "New York, NY", "Tampa, FL"].map((loc) => (
              <div
                key={loc}
                className="p-6 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                <h3 className="text-xl font-bold mb-2">{loc}</h3>
                <p className="text-gray-400">
                  123 Business Blvd, Suite 100
                  <br />
                  {loc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  );
}
