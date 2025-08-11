// src/types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL?: string;
    }
  }
}
export {};