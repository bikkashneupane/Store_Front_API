import mongoose from "mongoose";

export const mongoConnect = () => {
  try {
    mongoose.connect(process.env.MONGO_URI) && console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
