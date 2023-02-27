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
    passwordTokenURL: string
  ) {
    transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: process.env.USER_EMAIL_TO,
      subject: "Recuperação de senha",
      html: `
        <div>
          <button>
            <a href="${passwordTokenURL}">Clique aqui para trocar de senha.</a>
          </button>
        </div>`,
    });
  }

  sendEmail(passwordTokenURL: string) {
    const transporter = this.createTransport();
    this.createEmailStructure(transporter, passwordTokenURL);
  }
}

export default Email;
