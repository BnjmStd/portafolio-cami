import { defineMiddleware } from "astro:middleware";
import { verifyAuthToken } from "./utils/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = context.cookies.get("_admin_token")?.value;
    if (!verifyAuthToken(token || "")) {
      return context.redirect("/admin/login");
    }
  }

  return next();
});
