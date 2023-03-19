import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>;

    authenticatedUser: {
      userId: string;
      isPro: true;
      isAdmin: true;
      username: string;
    };
    isLoggedIn: boolean;
  }
}
