import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
            // Development bypass - skip auth checks if SKIP_AUTH is true
            const skipAuth = process.env.SKIP_AUTH === 'true';
            if (skipAuth) {
                return true;
            }

            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                const isAdmin = (auth?.user as any)?.role === "ADMIN";
                if (isLoggedIn && isAdmin) return true;
                return false; // Redirect unauthenticated or non-admin users to login page
            } else if (isLoggedIn && (nextUrl.pathname === '/auth/login' || nextUrl.pathname === '/auth/register')) {
                // Redirect logged in users away from auth pages
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
