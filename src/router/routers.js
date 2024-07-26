import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import productRouter from "./productRouter.js";

export const routes = [
  {
    path: "/users",
    middlewares: [userRouter],
  },
  {
    path: "/categories",
    middlewares: [categoryRouter],
  },
  {
    path: "/products",
    middlewares: [productRouter],
  },
];
