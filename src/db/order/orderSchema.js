import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "processing",
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    items: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        salesPrice: {
          type: Number,
          required: false,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Orders", schema);
