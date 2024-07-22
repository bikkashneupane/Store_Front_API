import JWT from "jsonwebtoken";
import { insertSession } from "../db/session/sessionModel.js";
import { updateUser } from "../db/user/userModel.js";

// sign access JWT
export const signAccessJWT = (email) => {
  const token = JWT.sign({ email }, process.env.SK_ACCESS, {
    expiresIn: "20m",
  });
  console.log(token);
  // update the session table
  insertSession({ token, associate: email });
  return token;
};

// verify access JWT
export const verifyAccessJWT = (token) => {
  try {
    return JWT.verify(token, process.env.SK_ACCESS);
  } catch (error) {
    console.log(error);
    return error;
  }
};

// sign refresh JWT
export const signRefreshJWT = (email) => {
  const refreshJWT = JWT.sign({ email }, process.env.SK_REFRESH, {
    expiresIn: "20d",
  });

  // update the user table
  updateUser({ email }, { refreshJWT });
  return refreshJWT;
};

// verify refresh JWT
export const verifyRefreshJWT = (token) => {
  try {
    return JWT.verify(token, process.env.SK_REFRESH);
  } catch (error) {
    return error;
  }
};

// sign tokens
export const signTokens = (email) => {
  const accessJWT = signAccessJWT(email);
  const refreshJWT = signRefreshJWT(email);

  return { accessJWT, refreshJWT };
};
