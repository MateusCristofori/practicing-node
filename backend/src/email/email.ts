import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ajhororow12@gmail.com",
    pass: "ilizxujnimtzpngd"
  }
});

transport.sendMail({
  from: "Aplicação blog <ajhororow12@gmail.com>",
  to: "mateuscristofori@gmail.com",
  subject: "Teste de recuperação de senha",
  html: "<h1>Recuperação de senha </h1> <p>Envio de email para a recuperação de senha</p>",
}).then((response) => {
  console.log("Email enviado com sucesso.");
}).catch((err) => {
  console.log("erro ao enviar o email", err);
});