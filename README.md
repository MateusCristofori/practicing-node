# API Blog.
API feita em **Node.Js**, **JWT** e **MongoDB** para autenticações e autorizações com base em roles (permissões) dos usuários.

# Instalação e executação do projeto
## Dependências globais
Precisa-se ter o Node.Js instalado e que seja na versão **Node.Js v18.12.1** ou superior.

## Dependências locais
Deve-se rodar o comando ``` npm install ``` no terminal para instalar todas as dependências necessárias para a execução da aplicação.

## Execução da aplicação
Após a instalar todas as dependências, basta rodar o comando ```npm run dev```. Isso irá iniciar a aplicação por completo.
A aplicação está setada para rodar no endereço: 
```http://localhost:3000```

Observações:
* Para derrubar a aplicação, basta utilizar as telcas ```CTRL+C```.

## Cadastro e login de usuários
### Criar usuário manualmente
* Para se criar um novo usuário na aplicação, acesse http://localhost:3000/blog/register.
* Preencha os dados em um client com os atributos (```"name", "email", "password"```). Pode-se passar, também, um atributo ```role``` que irá definir o nível de permissão do usuário dentro da aplicação. Mas, caso não tenha sido passado, o padrão de criação de usuário sempre será como a ```"role"``` sendo ```"reader"``` que representa o nível mais baixo de permissão.
* Pode-se utilizar qualquer email durante o processo de cadastro de usuário. Mesmo que o email não exista como por exemplo: ```teste@teste.com```.
* Caso o usuário tente enviar uma requisição com os campos vazios, um erro será disparado na pilha de execução do projeto, a ação será invalidada e uma mensagem de erro será retornada.

### Login de usuários
* Para o processo de login, acesse a rota ```http://localhost:3000/blog/login``` passando o ```"email"``` e ```"password"``` cadastrados anteriormente.
* Após o processo de login, o usuário terá acesso as rotas privadas que necessitavam de login. 
* As rotas disponíveis são: ```users/dashboard```, ```users/news```, essa rota poderá receber requisições do tipo **POST** a depender do nível de permissão do usuário na plataforma, e ```users/logout``` onde realizará o processo de logout do usuário e irá invalidar o token usado pelo mesmo, fazendo necessário realizar o processo de login novamente.
