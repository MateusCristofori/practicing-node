import { BadRequestError } from "../helpers/Errors/api_error";

export class Validation {
  static checkUserName = (name: string) => {
    if (!name) {
      throw new BadRequestError("Campo 'nome' deve ser preenchido!");
    }
  }

  static checkUserEmail = (email: string) => {
    if(!email) {
      throw new BadRequestError("Campo 'email' deve ser preenchido!");
    }
  }

  static checkUserPassword = (password: string) => {
    if(!password) {
      throw new BadRequestError("Campo 'senha' deve ser preenchido!");
    }
  }
}

export class CreateNewsValidation {
  static checkTitle(title: string) {
    if(!title) {
      throw new BadRequestError("A notícia deve possuir um título!");
    }
  }

  static checkSubTitle(subTitle: string) {
    if(!subTitle) {
      throw new BadRequestError("A notícia deve possuir um subtítulo!");
    }
  }

  static checkCategory(category: string) {
    if(!category) {
      throw new BadRequestError("A notícia deve possuir uma categoria!");
    }    
  }

  static checkSubject(subject: string) {
    if(!subject) {
      throw new BadRequestError("A notícia deve possuir conteúdo condizente com sua categoria!");
    }
  }
}