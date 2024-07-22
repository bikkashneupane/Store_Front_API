import nodemailer from "nodemailer";

// global email processor
const emailProcessor = async (mailBody) => {
  //transporter
  const transport = nodemailer.createTransport({
    host: `${process.env.SMTP_HOST}`,
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: `${process.env.SMTP_EMAIL}`,
      pass: `${process.env.SMTP_PASS}`,
    },
  });

  // send mail
  await transport.sendMail(mailBody);
};

// email verification email
export const emailVerificationMail = (email, firstName, url) => {
  const mailBody = {
    from: `"${process.env.SMTP_SENDER}" <${process.env.SMTP_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Verify Account",
    text: `Hello ${firstName}, Please follow the link to verify your account: ${url}`,
    html: `<b>Hello ${firstName}</b>
            <p>Click the button below to verify your account. </p>
            <a href=${url} style ="padding:1rem; background:green">Verify Now </a><br/>
            <p>If the button does not work above, please copy the following url and paste in your browser ${url}</p>`, // html body
  };

  return emailProcessor(mailBody);
};
