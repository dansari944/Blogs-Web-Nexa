import BlogGrid from "./Components/BlogGrid";

const mockBlogs = [
  {
    title: "How Modern Web Apps Are Built",
    excerpt: "A deep dive into scalable frontend architecture...",
  },
  {
    title: "Understanding SEO for Developers",
    excerpt: "Practical SEO strategies that actually work...",
  },
  {
    title: "Why Performance Matters in UX",
    excerpt: "Speed, perception and user psychology explained...",
  },
];

export default function HomePage() {
  return (
    <>
      {/* <Hero /> */}
      <BlogGrid blogs={mockBlogs} />
    </>
  );
}
