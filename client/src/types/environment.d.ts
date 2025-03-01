export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_DOMAIN: string;
      JWT_SECRET: string;
      DOMAIN: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
    }
  }
}
