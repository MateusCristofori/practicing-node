# API Blog.
API feita em **Node.Js**, **JWT** e **MySQL** para autenticações e autorizações com base em roles (permissões) dos usuários.

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
* Preencha os dados em um client com os atributos (```"name", "email", "password"```). Pode-se passar, também, um atributo ```role``` que irá definir o nível de permissão do usuário dentro da aplicação. Mas, caso não tenha sido passado, o padrão de criação de usuário sempre será como a ```"role"``` sendo ```"reader"``` que representa o nível mais baixo de permissão.
* Pode-se utilizar qualquer email durante o processo de cadastro de usuário. Mesmo que o email não exista como por exemplo: ```teste@teste.com```.
* Caso o usuário tente enviar uma requisição com os campos vazios, um erro será disparado na pilha de execução do projeto, a ação será invalidada e uma mensagem de erro será retornada.

### Login de usuários
* Para o processo de login, acesse a rota ```http://localhost:8000/login``` passando o ```"email"``` e ```"password"``` cadastrados anteriormente.
* O email para login precisa receber o símbolo de **arroba** para ser validado.
* Após o processo de login, o usuário terá acesso as rotas privadas da aplicação.

## Rotas privadas
As rotas disponíveis após o processo de logIn são:
  * ```/dashboard``` Para o usuário ter acesso as suas notícias cadastradas, caso tenha permissão para isso.
  * ```/logout``` Para o usuário conseguir realizar o processo de logout da aplicação. Após esse processo, seu Token de autenticação será invalidado e precisará realizar novamente o login.
  * ```/recover``` onde o usuário poderá trocar/recuperar a senha. Será gerado um Token válido para realizar a recuperação de senha. Após o processo ser finalizado, esse Token será invalidado e precisará realizar novamente todo o processo de recuperação.
