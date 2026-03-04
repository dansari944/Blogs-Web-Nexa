import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const categories = await mongoose.connection
      .collection("mstd_category_types")
      .find({ status: true })
      .project({ name: 1, slug: 1, description: 1 })
      .sort({ name: 1 })
      .toArray();

    const subCategories = await mongoose.connection
      .collection("mstd_subcategory_types")
      .find({})
      .project({ name: 1, slug: 1, categoryId: 1 })
      .toArray();
    return NextResponse.json({
      categories,
      subCategories,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
