import express from "express";
import { comparePassword, hashPassword } from "../util/bcrypt.js";
import {
  deleteUserById,
  getUser,
  insertUser,
  updateUser,
} from "../db/user/userModel.js";
import {
  loginUserValidator,
  newUserValidator,
  updateUserValidator,
} from "../middlewares/joi.js";
import { v4 as uuidv4 } from "uuid";
import {
  emailVerificationMail,
  emailVerifiedNotification,
} from "../services/email/nodeMailer.js";
import {
  deleteSession,
  findSession,
  insertSession,
} from "../db/session/sessionModel.js";
import { signAccessJWT, signTokens } from "../util/jwt.js";
import { auth, jwtAuth } from "../middlewares/auth.js";

const router = express.Router();

// signup
router.post("/signup", newUserValidator, async (req, res, next) => {
  try {
    // hash password
    req.body.password = hashPassword(req.body.password);

    const newUser = await insertUser(req.body);
    if (newUser?._id) {
      const uniqueKey = uuidv4();

      // send email to verify account
      const sendEmail = await emailVerificationMail({
        email: newUser.email,
        firstName: newUser.firstName,
        uniqueKey,
      });

      // save uniqueKey as token to verify the account later
      if (sendEmail) {
        await insertSession({
          token: uniqueKey,
          associate: newUser.email,
          type: "verification",
        });
      }

      return res.json({
        status: "success",
        message: "Register Success, Please Check Your Email To Verify Account.",
      });
    }

    res.json({
      status: "error",
      message: "Could not register account, try again",
    });
  } catch (error) {
    error.message =
      error.message.includes("E11000 duplicate key error collection:") &&
      "Email Already Registered, Choose Different Email.";

    next(error);
  }
});

// verify-account
router.post("/verify-account", async (req, res, next) => {
  try {
    const { uniqueKey, email } = req.body;

    // find token
    const tokenObj = await findSession({
      token: uniqueKey,
      associate: email,
      type: "verification",
    });

    if (tokenObj?._id) {
      // 1. update user
      const updatedUser = await updateUser(
        {
          email,
        },
        {
          isEmailVerified: true,
          status: "active",
        }
      );

      if (updatedUser?._id) {
        // 2. delete token
        await deleteSession({
          token: uniqueKey,
          associate: email,
          type: "verification",
        });

        // account verification notification mail
        await emailVerifiedNotification({
          email,
          firstName: updatedUser?.firstName,
        });

        return res.json({
          status: "success",
          message: "Account Verified, Login Now.",
        });
      }
    }

    res.json({
      status: "error",
      message: "Could not verify account, try again",
    });
  } catch (error) {
    next(error);
  }
});

// login
router.post("/login", loginUserValidator, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUser({ email });

    if (user?._id) {
      const isPassword = comparePassword(password, user.password);

      return isPassword
        ? res.json({
            status: "success",
            tokens: signTokens(email),
          })
        : res.json({
            status: "error",
            message: "Incorrect Password",
          });
    }

    res.json({
      status: "error",
      message: "Incorrect Email or Password",
    });
  } catch (error) {
    next(error);
  }
});

// user profile
router.get("/profile", auth, async (req, res, next) => {
  try {
    req.userInfo.password = undefined;

    res.json({
      status: "success",
      message: "",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// renew access
router.get("/renew-access", jwtAuth, async (req, res, next) => {
  try {
    const { email } = req.userInfo;

    res.json({
      status: "success",
      message: "",
      accessJWT: signAccessJWT(email),
    });
  } catch (error) {
    next(error);
  }
});

// update profile detail
router.patch(
  "/update-profile",
  auth,
  updateUserValidator,
  async (req, res, next) => {
    try {
      const email = req.userInfo.email;
      const currentPassword = req.userInfo.password;

      const { password, ...rest } = req.body;

      // compare password first
      // verify password first
      const verifyPassword = comparePassword(password, currentPassword);

      // if true proceed to update
      if (verifyPassword) {
        const updatedUser = await updateUser({ email }, { ...rest });
        return updatedUser?._id
          ? res.json({
              status: "success",
              message: "User Profile Updated",
            })
          : res.json({
              status: "error",
              message: "Couldn't update Profile, try again",
            });
      }

      res.json({
        status: "error",
        message: "Incorrect Passoword",
      });
    } catch (error) {
      next(error);
    }
  }
);

// update-password
router.patch(
  "/update-profile",
  auth,
  updateUserValidator,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // get user password after authenticating
      const { email, password } = req.userInfo;

      // verify password first
      const verifyPassword = comparePassword(currentPassword, password);

      // update password
      if (verifyPassword) {
        const updatedPassword = password && hashPassword(newPassword);
        const updatedUser = await updateUser(
          { email },
          { password: updatedPassword }
        );

        if (updatedUser?._id) {
          return res.json({
            status: "success",
            message: "Password Updated",
          });
        }
      }

      res.json({
        status: "error",
        message: "Couldn't update Password, try again",
      });
    } catch (error) {
      next(error);
    }
  }
);

// delete-account
router.delete("/delete-account/:_id?", auth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id);

    const user = await deleteUserById(_id);

    user?._id
      ? res.json({
          status: "success",
          message: "Account Deleted",
        })
      : res.json({
          status: "error",
          message: "Couldn't Delete Account, Try Again",
        });
  } catch (error) {
    next(error);
  }
});

// otp request

// reset-password

export default router;
