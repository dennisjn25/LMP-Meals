import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // We need to separate config to avoid Prisma in edge

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
