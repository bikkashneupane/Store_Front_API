import { mongoose } from "mongoose";

const schema = new mongoose.Schema(
  {
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "inactive",
    },
    role: {
      type: String,
      default: "user",
    },
    firstName: {
      type: String,
      maxLength: [100, "First Name Character Length exceeded..."],
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshJWT: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Users", schema);
