declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET: string;
      DATABASE_URL: string;
      USER_EMAIL: string;
      APP_PASSWORD_EMAIL: string;
      USER_EMAIL_TO: string;
      URL_CHANGE_PASSWORD: string;
    }
  }
}

export {};
