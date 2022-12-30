# API Blog.
API feita em **Node.Js**, **JWT** e **MongoDB** para autenticações e autorizações com base em roles (permissões) dos usuários.

# Instalação e executação do projeto
## Dependências globais
Precisa-se ter o Node.Js instalado e que seja na versão **Node.Js v18.12.1** ou superior.

## Dependências locais
Deve-se rodar o comando ``` npm install ``` no terminal para instalar todas as dependências necessárias para a execução da aplicação.

## Execução da aplicação
Após a instalar todas as dependências da aplicação, basta rodar o comando ```npm run dev```. Isso irá iniciar a aplicação por completo.
A aplicação está setada para rodar no endereço: 
```http://localhost:3000```

Observações:
* Para derrubar a aplicação, basta utilizar as telcas ```CTRL+C```.
* Caso seja necessário, pode-se conferir o arquivo ```.env``` para ter acesso a mais informações da aplicação.

## Cadastro e login de usuários
### Criar usuário manualmente
* Para se criar um novo usuário na aplicação, acesse http://localhost:3000/blog/register.
* Preencha os dados em um client com os atributos **name", **email**, **password**. Pode-se passar, também, um atributo **role** que irá definir o nível de permissão do usuário dentro da aplicação. Mas, caso não tenha sido passado, o padrão de criação de usuário sempre será como a **role** sendo **reader** que representa o nível mais baixo de permissão.
