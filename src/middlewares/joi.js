import JOI from "joi";

const STR = JOI.string();
const STR_REQ = JOI.string().required();
const NUM = JOI.number().allow(null, "");
const NUM_REQ = JOI.number().required();
const EMAIL = JOI.string()
  .required()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } });

// global joiValidator
const joiValidator = (schema, req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    return error ? res.json(error) : next();
  } catch (error) {
    next(error);
  }
};

// new user validatior
export const newUserValidator = (req, res, next) => {
  const schema = JOI.object({
    firstName: STR_REQ,
    lastName: STR_REQ,
    phone: NUM,
    email: EMAIL,
    password: STR_REQ,
  });

  return joiValidator(schema, req, res, next);
};

// login user validatior
export const loginUserValidator = (req, res, next) => {
  const schema = JOI.object({
    email: EMAIL,
    password: STR_REQ,
  });

  return joiValidator(schema, req, res, next);
};

// update user profile validatior
export const updateUserValidator = (req, res, next) => {
  const schema = JOI.object({
    firstName: STR_REQ,
    lastName: STR_REQ,
    phone: NUM,
  });

  return joiValidator(schema, req, res, next);
};

// update user validatior
export const updatePasswordValidator = (req, res, next) => {
  const schema = JOI.object({
    currentPassword: STR_REQ,
    newPassword: STR_REQ,
  });

  return joiValidator(schema, req, res, next);
};

// new review validatior
export const newReviewValidator = (req, res, next) => {
  const schema = JOI.object({
    title: STR_REQ,
    message: STR_REQ,
    ratings: NUM_REQ,
    productId: STR_REQ,
    orderId: STR_REQ,
  });

  return joiValidator(schema, req, res, next);
};
