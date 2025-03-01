export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: number;
      DATABASE_URL: string;
      CORS_LIST: string;
      JWT_SECRET: string;
    }
  }
}
