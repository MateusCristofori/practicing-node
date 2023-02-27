import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class Email {
  createTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASSWORD_EMAIL,
      },
    });
    return transporter;
  }

  createEmailStructure(
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
    passwordToken: string
  ) {
    transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: process.env.USER_EMAIL_TO,
      subject: "Recuperação de senha",
      text: passwordToken,
    });
  }

  sendEmail(passwordTokenURL: string) {
    const transporter = this.createTransport();
    this.createEmailStructure(transporter, passwordTokenURL);
  }
}

export default Email;
