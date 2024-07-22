import bcrypt from "bcrypt";

// hash password
export const hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, +process.env.SALT_ROUND);
};

// compare password
export const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};
