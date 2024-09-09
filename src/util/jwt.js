import JWT from "jsonwebtoken";
import { insertSession } from "../db/session/sessionModel.js";
import { updateUser } from "../db/user/userModel.js";

// sign access JWT
export const signAccessJWT = async (email) => {
  try {
    const token = JWT.sign({ email }, process.env.SK_ACCESS, {
      expiresIn: "20m",
    });
    await insertSession({ token, associate: email });

    return token;
  } catch (error) {
    console.error("Error inserting session:", error);
  }
};

// verify access JWT
export const verifyAccessJWT = (token) => {
  try {
    return JWT.verify(token, process.env.SK_ACCESS);
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      return "jwt expired";
    }
    return "Invalid Token";
  }
};

// sign refresh JWT
export const signRefreshJWT = async (email) => {
  try {
    const refreshJWT = JWT.sign({ email }, process.env.SK_REFRESH, {
      expiresIn: "30d",
    });

    updateUser({ email }, { refreshJWT });
    return refreshJWT;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

// verify refresh JWT
export const verifyRefreshJWT = (token) => {
  try {
    return JWT.verify(token, process.env.SK_REFRESH);
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      return "jwt expired";
    }
    return "Invalid Token";
  }
};

// sign tokens
export const signTokens = async (email) => {
  const tokenPromises = new Promise(signAccessJWT);
  const accessJWT = await signAccessJWT(email);
  const refreshJWT = await signRefreshJWT(email);

  return { accessJWT, refreshJWT };
};
