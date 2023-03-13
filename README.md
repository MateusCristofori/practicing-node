# API Node.Js.
API feita em **Node.Js**, **JWT**, **TypeScript** e **MySQL** para autenticações e autorizações com base em roles (permissões) dos usuários.

# Instalação e executação do projeto
## Dependências globais
Precisa-se ter o Node.Js instalado e que seja na versão **Node.Js v18.12.1** ou superior.

## Dependências locais
Deve-se rodar o comando ``` npm install ``` no terminal para instalar todas as dependências necessárias para a execução da aplicação.

## Execução da aplicação
Após a instalar todas as dependências, basta rodar o comando ```npm run dev```. Isso irá iniciar a aplicação por completo.
A aplicação está setada para rodar no endereço: 
```http://localhost:8000```

Observações:
* Para derrubar a aplicação, basta utilizar as telcas ```CTRL+C```.

## Cadastro e login de usuários
### Criar usuário manualmente
* Para se criar um novo usuário na aplicação, acesse http://localhost:8000/register.
* Preencha os dados em um client com os atributos (```"name", "email", "password"```). O padrão de criação de usuário sempre será como a ```"role"``` sendo ```"reader"``` que representa o nível mais baixo de permissão.
* É recomendado o uso de e-mail existente para não acarretar em problemas no processo de recuperação de senha.
* Caso o usuário tente enviar uma requisição com os campos vazios, um erro será disparado na pilha de execução do projeto, a ação será invalidada e uma mensagem de erro será retornada.

### Login de usuários e recuperação de senha
* Para o processo de login, acesse a rota ```http://localhost:8000/login``` passando o ```"email"``` e ```"password"``` cadastrados anteriormente.
* O email para login precisa receber o símbolo de **arroba** para ser validado.
* Após o processo de login, o usuário terá acesso as rotas privadas da aplicação.
* Caso seja necessário, o usuário poderá acessar a rota ```http://localhost:8000/recover``` para realizar a recuperação de senha. Um token será gerado para tornar válido o processo de recuperação. A URL será enviada para o e-mail do usuário juntamente com o token. Após o processo ser finalizado, esse Token será invalidado e precisará realizar novamente todo o processo de recuperação. O usuário deverá passar o email para o token ser gerado.

## Rotas privadas
#### As rotas para usuários logados no sistema são:
* O usuário poderá acessar a rota ```/dashboard``` para ter acesso a todas as suas notícias cadastradas, caso tenha permissão para isso;
* O usuário poderá acessar a rota ```/update``` para conseguir realizar a atualização das suas informações;
* O usuário poderá acessar a rota ```/logout``` para conseguir realizar o processo de logout da aplicação. Nota-se que após esse processo, o token de autenticação será invalidado e o login deverá ser refeito.
* O usuário poderá acessar a rota ```/delete``` para conseguir realizar a deleção do seu perfil. O usuário deverá enviar seu email no corpo da requisição. Após isso, o sistema enviará um email para o usuário contendo um botão que irá redirecioná-lo para a URL correta onde o processo será finalizado.
#### As rotas para notícias são:
*  
