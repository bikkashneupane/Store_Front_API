import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import productRouter from "./productRouter.js";
import orderRouter from "./orderRouter.js";

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
  {
    path: "/orders",
    middlewares: [orderRouter],
  },
];
