import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/api/assistant/create",
    "/api/thread",
    "/api/message/list",
    "/api/message/create",
    "/api/run/create",
    "/api/run/retrieve",
    "/api/challenge-users",
    "/api/challenge-preferences",
    "/api/openai",
  ],
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
