import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ prevent model overwrite in dev hot reload
export default mongoose.models.mstd_category_type ||
  mongoose.model("mstd_category_type", CategorySchema);