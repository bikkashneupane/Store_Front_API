import nodemailer from "nodemailer";

// global email processor
const emailProcessor = async (mailBody) => {
  //transporter
  const transport = nodemailer.createTransport({
    // host: `${process.env.SMTP_HOST}`,
    // port: 587,
    // secure: false, // Use `true` for port 465, `false` for all other ports
    service: `${process.env.SMTP_HOST}`,
    auth: {
      user: `${process.env.SMTP_EMAIL}`,
      pass: `${process.env.SMTP_PASSWORD}`,
    },
  });

  // send mail
  const mail = await transport.sendMail(mailBody);
  return mail;
};

// Email Verification Mail
export const emailVerificationMail = ({ email, firstName, uniqueKey }) => {
  const url = `${process.env.FRONTEND_ROOT}/verify-account?uk=${uniqueKey}&e=${email}`;

  const mailBody = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email, // list of receivers
    subject: "Verify Your Account",
    text: `Hello ${firstName},\n\nThank you for signing up! Please follow the link to verify your account:\n\n${url}\n\nIf you did not sign up for an account, please ignore this email.\n\nBest regards,\nThe Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Welcome to Our Service, ${firstName}!</h2>
          <p>Thank you for creating an account with us. To complete your registration, please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 20px;">
            <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Now</a>
          </div>
          <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
          <p style="word-wrap: break-word;"><a href="${url}" style="color: #4CAF50;">${url}</a></p>
          <p>If you did not sign up for an account, please ignore this email.</p>
          <p>Best regards,<br/>Vikiasmy's</p>
        </div>
      </div>`,
  };

  return emailProcessor(mailBody);
};

// Email Verified Mail
export const emailVerifiedNotification = ({ email, firstName }) => {
  const mailBody = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email, // list of receivers
    subject: "Your Account is Now Verified! Log In to Start Shopping",
    text: `Hello ${firstName},\n\nCongratulations! Your account has been successfully verified. You can now log in to purchase your favorite watches and accessories.\n\nBest regards,\nThe Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Congratulations, ${firstName}!</h2>
          <p>Your account has been successfully verified.</p>
          <p>You can now log in to explore and purchase your favorite watches and accessories from our collection.</p>
          <div style="text-align: center; margin: 20px;">
            <a href="${process.env.FRONTEND_ROOT}/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In Now</a>
          </div>
          <p>If you have any questions or need assistance, please do not hesitate to contact our support team.</p>
          <p>Happy Shopping!</p>
          <p>Best regards,<br/>Vikiasmy's</p>
        </div>
      </div>`,
  };

  return emailProcessor(mailBody);
};

// OPT email
export const sendOTPMail = ({ email, firstName, token }) => {
  const obj = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your One-Time Password (OTP) for Account Security",
    text: `Hello ${firstName},\n\nYour One-Time Password (OTP) is: ${token}\n\nPlease use this OTP to complete your request. If you did not request this, please contact our support team immediately.\n\nBest regards,\nThe Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Hello ${firstName},</h2>
          <p>We have received a request to reset your password. To proceed, please use the One-Time Password (OTP) provided below:</p>
          <div style="text-align: center; margin: 20px;">
            <p style="font-size: 24px; font-weight: bold; color: #333; border: 1px dashed #4CAF50; padding: 10px; display: inline-block;">${token}</p>
          </div>
          <p>This OTP is valid for a limited time only. If you did not request a password reset, please contact our support team immediately to secure your account.</p>
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br/>Vikiasmy's</p>
        </div>
      </div>`,
  };

  emailProcessor(obj);
};

// password update notification
export const accountUpdateNotification = ({ email, firstName }) => {
  const obj = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your Password Has Been Successfully Updated",
    text: `Hello ${firstName},\n\nWe wanted to let you know that your password has been successfully updated. If you did not make this change, please contact our support team immediately.\n\nBest regards,\nThe Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Hello ${firstName},</h2>
          <p>We wanted to inform you that your password has been successfully updated.</p>
          <p>If you made this change, no further action is required. If you did not request a password update, please contact our support team immediately to secure your account.</p>
          <div style="text-align: center; margin: 20px;">
            <a href="mailto:support@vikiasmy.com" style="background-color: #FF5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Contact Support</a>
          </div>
          <p>For your security, please ensure that your account information is always up to date and keep your password confidential.</p>
          <p>Best regards,<br/>Vikiasmy's</p>
        </div>
      </div>`,
  };

  emailProcessor(obj);
};

// send email receipt
export const sendEmailReceipt = ({ email, firstName, orderDetails }) => {
  const {
    total,
    itemName,
    quantity,
    amount,
    estimatedArrival,
    shippingAddress,
  } = orderDetails;
  const obj = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your Order Receipt from Vikiamy's",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Thank you for your purchase, ${firstName}!</h2>
          <p>Your order is in the works. We sent you an email to ${email} with your order receipt.</p>
          <h3>Order Summary</h3>
          <p><strong>Total:</strong> ${total}</p>
          <p><strong>Item:</strong> ${itemName}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Amount:</strong> ${amount}</p>
          <h3>Estimated Arrival</h3>
          <p>${estimatedArrival}</p>
          <p>To ensure prompt delivery, some items may be shipped separately.</p>
          <h3>Shipping To</h3>
          <p>${shippingAddress}</p>
          <h3>Need Help?</h3>
          <p>If you have any questions, contact us at <a href="mailto:support@vikiamy.com">support@vikiamy.com</a> or call (02) 9876 5432.</p>
          <p>Need to return something? Print or show this email in-store to use as a receipt.</p>
          <p>Thank you for shopping with us!<br>Vikiamy's</p>
        </div>
      </div>
    `,
  };

  emailProcessor(obj);
};
