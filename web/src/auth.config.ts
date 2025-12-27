import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            async authorize(credentials) {
                return null; // Logic is in auth.ts
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            // CRITICAL SECURITY: Development bypass - ONLY works in development, NEVER in production
            const isDevelopment = process.env.NODE_ENV !== 'production';
            const skipAuth = isDevelopment && process.env.SKIP_AUTH === 'true';

            if (skipAuth) {
                console.warn('⚠️  SKIP_AUTH is enabled - this should ONLY be used in development!');
                return true;
            }

            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                // CRITICAL: Admin portal requires BOTH authentication AND admin role
                const isAdmin = (auth?.user as any)?.role === "ADMIN";

                if (!isLoggedIn) {
                    // Not logged in - redirect to login
                    return false;
                }

                if (!isAdmin) {
                    // Logged in but not admin - redirect to home
                    return Response.redirect(new URL('/', nextUrl));
                }

                // Logged in AND admin - allow access
                return true;
            } else if (isLoggedIn && (nextUrl.pathname === '/auth/login' || nextUrl.pathname === '/auth/register')) {
                // Redirect logged in users away from auth pages
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
