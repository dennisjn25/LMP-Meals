import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db as any) as any,
    session: { strategy: "jwt" },
    providers: [
        ...authConfig.providers.filter((provider: any) => provider.id !== "credentials"),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await db.user.findUnique({
                        where: { email }
                    });

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (passwordsMatch) return user;
                }

                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }

            if (session.user) {
                // @ts-ignore
                session.user.phone = token.phone;
                // @ts-ignore
                session.user.deliveryAddress = token.deliveryAddress;
                // @ts-ignore
                session.user.deliveryCity = token.deliveryCity;
                // @ts-ignore
                session.user.deliveryZip = token.deliveryZip;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await db.user.findUnique({
                where: { id: token.sub }
            });

            if (!existingUser) return token;

            token.role = existingUser.role;
            token.phone = existingUser.phone;
            token.deliveryAddress = existingUser.deliveryAddress;
            token.deliveryCity = existingUser.deliveryCity;
            token.deliveryZip = existingUser.deliveryZip;

            return token;
        }
    },
});
