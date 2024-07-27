import { findSession } from "../db/session/sessionModel.js";
import { getUser } from "../db/user/userModel.js";
import { verifyAccessJWT, verifyRefreshJWT } from "../util/jwt.js";

// authenticate user using access jwt
export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // verfy access jwt
    const decoded = verifyAccessJWT(authorization);

    if (decoded?.email) {
      // get token
      const tokenObj = await findSession({ token: authorization });

      if (tokenObj._id) {
        // get user
        const user = await getUser({ email: decoded.email });

        if (user?._id) {
          if (!user.isEmailVerified) {
            return res.json({
              status: "error",
              message: " Account Not Verified. Check email to Verify Now.",
            });
          }

          user.__v = undefined;
          user.refreshJWT = undefined;

          req.userInfo = user;
          return next();
        }
      }
    }

    // if error
    res.json({
      status: 401,
      message: decoded,
    });
  } catch (error) {
    next(error);
  }
};

// authenticate user using refresh jwt
export const jwtAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    let errorMessage = "";

    // verfy access jwt
    const decoded = verifyRefreshJWT(authorization);

    if (decoded?.email) {
      // get user
      const user = await getUser({ email: decoded.email });

      if (user?._id) {
        if (!user.isEmailVerified) {
          return (errorMessage = "Account Not Verified.");
        }

        user.__v = undefined;
        user.refreshJWT = undefined;

        req.userInfo = user;
        return next();
      }
    }

    // if error
    res.json({
      status: 401,
      message: errorMessage ? errorMessage : decoded,
    });
  } catch (error) {
    next(error);
  }
};
