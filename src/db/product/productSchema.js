import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      unique: [true, "Thi SKU has already in use, please enter new SKU."],
      index: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    brandId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    materialId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    gender: {
      type: String,
      default: "unisex",
      enum: ["men", "women", "unisex"],
    },
    salesPrice: {
      type: Number,
      default: null,
    },
    salesStart: {
      type: Date,
      default: null,
    },
    salesEnd: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Products", schema);
