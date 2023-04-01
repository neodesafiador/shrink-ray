import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>;

    authenticatedUser: {
      userId: string;
      isPro: boolean;
      isAdmin: boolean;
      username: string;
    };
    isLoggedIn: boolean;
  }
}
