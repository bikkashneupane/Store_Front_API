import userRouter from "./userRouter.js";

export const routes = [
  {
    path: "/users",
    middlewares: [userRouter],
  },
];
