import express from "express";
import { hashPassword } from "../util/bcrypt.js";
import { insertUser, updateUser } from "../db/user/userModel.js";
import { newUserValidator } from "../util/joi.js";
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
      const sendEmail = emailVerificationMail({
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
    next(error);
  }
});

// login

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

// otp request

// reset-password

// update-profile

// delete-account

export default router;
