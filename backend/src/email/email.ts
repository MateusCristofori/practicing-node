import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class Email {
  private static email: typeof nodemailer;

  static createTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo>{
    return this.email.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_HASH
      }
    });
  }

  static sendEmail() {
    this.createTransport().sendMail({
      from: "Aplicação blog <ajhororow12@gmail.com>",
      to: "mateuscristofori@gmail.com",
      subject: "Teste de recuperação de senha",
      html: "<h1>Recuperação de senha</h1> <p>Envio de email para a recuperação de senha</p>",
    }).then((response) => {
      console.log("Email enviado com sucesso.");
    }).catch((err) => {
      console.log("erro ao enviar o email", err);
    });
  }
}