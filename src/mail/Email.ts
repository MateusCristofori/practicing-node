import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class Email {
  createTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });
    return transporter;
  }

  createEmailStructure(
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
    actionToken: string,
    subject: string,
    infoText: string
  ) {
    transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: process.env.USER_EMAIL_TO,
      subject: subject,
      html: `
        <div>
          <button>
            <a href="${actionToken}">${infoText}</a>
          </button>
        </div>`,
    });
  }

  sendEmail(actionToken: string, subject: string, infoText: string) {
    const transporter = this.createTransport();
    this.createEmailStructure(transporter, actionToken, subject, infoText);
  }
}

export default Email;
  