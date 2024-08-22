import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import productRouter from "./productRouter.js";
import reviewRouter from "./reviewRouter.js";

export const routes = [
  {
    path: "/v1/users",
    middlewares: [userRouter],
  },
  {
    path: "/v1/categories",
    middlewares: [categoryRouter],
  },
  {
    path: "/v1/products",
    middlewares: [productRouter],
  },
  {
    path: "/v1/reviews",
    middlewares: [reviewRouter],
  },
];
