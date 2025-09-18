import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      role: "admin" | "hr" | "viewer";
      loginTime: string;
    };
    csrfToken?: string;
  }
}