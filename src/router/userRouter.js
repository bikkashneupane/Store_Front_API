import express from "express";
import { hashPassword } from "../util/bcrypt.js";
import { insertUser } from "../db/user/userModel.js";
import { newUserValidator } from "../util/joi.js";
import { v4 as uuidv4 } from "uuid";
import { emailVerificationMail } from "../services/email/nodeMailer.js";

const router = express.Router();

// signup
router.post("/signup", newUserValidator, async (req, res, next) => {
  try {
    // hash password
    req.body.password = hashPassword(req.body.password);

    const newUser = await insertUser(req.body);

    if (newUser?._id) {
      // send email to verify account
      emailVerificationMail({
        email: newUser.email,
        firstName: newUser.firstName,
        uniqueKey: uuidv4(),
      });

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

// otp request

// reset-password

// update-profile

// delete-account

export default router;
