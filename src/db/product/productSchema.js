import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    title: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      unique: [true, "Thi SKU has already in use, please enter new SKU."],
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
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
    parentCategoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    sales: {
      isSales: {
        type: Boolean,
        default: false,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Products", schema);
