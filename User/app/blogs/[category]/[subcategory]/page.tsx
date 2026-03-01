import BlogFeed from "../../../components/BlogFeed";

export default function Page({
  params,
}: {
  params: { category: string; subcategory: string };
}) {
  const { category, subcategory } = params;

  return (
    <main
      className="min-h-screen bg-gray-50 pb-20"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 mb-14 text-center">
        <h1 className="text-4xl font-extrabold capitalize mb-4">
          {subcategory.replace(/-/g, " ")}
        </h1>

        <p className="text-gray-600">
          Latest stories and insights in{" "}
          {subcategory.replace(/-/g, " ")}.
        </p>
      </section>

      {/* BLOG FEED */}
      <BlogFeed
        category={category}
        subcategory={subcategory}
      />
    </main>
  );
}