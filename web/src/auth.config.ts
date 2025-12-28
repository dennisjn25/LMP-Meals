import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                return null; // Logic is in auth.ts
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
    },
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            if (token?.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token?.role && session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }

            return session;
        },
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
                // Admin portal requires authentication
                // specific role checks are handled in the page components/layout
                if (!isLoggedIn) {
                    // Not logged in - redirect to login
                    return false;
                }

                // Logged in - allow access (page will verify role)
                return true;
            } else if (isLoggedIn && (nextUrl.pathname === '/auth/login' || nextUrl.pathname === '/auth/register')) {
                // Redirect logged in users away from auth pages
                const userRole = (auth?.user as any)?.role;
                if (userRole === "ADMIN" || userRole === "EMPLOYEE") {
                    return Response.redirect(new URL('/admin', nextUrl));
                }
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
