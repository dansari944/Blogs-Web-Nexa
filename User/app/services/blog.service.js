export const getBlogCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/blog-categories`
  );

  const data = await res.json();
  return data.data;
};