import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>;

    authenticatedUser: {
      userId: string;
      username: string;
    };
    isLoggedIn: boolean;
  }
}
