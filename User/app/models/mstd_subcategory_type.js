import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mstd_category_type",
      required: true,
    },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.mstd_subcategory_type ||
  mongoose.model("mstd_subcategory_type", SubCategorySchema);