"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/actions/auth"; // We will create this
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export default function LoginForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
            });
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem' }}>WELCOME BACK</h2>

            <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>Email</label>
                    <input
                        {...form.register("email")}
                        type="email"
                        disabled={isPending}
                        style={{ width: '100%', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>Password</label>
                    <input
                        {...form.register("password")}
                        type="password"
                        disabled={isPending}
                        style={{ width: '100%', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    />
                    <div style={{ textAlign: 'right', marginTop: '8px' }}>
                        <Link href="/auth/reset" style={{ fontSize: '0.8rem', color: '#000', textDecoration: 'underline' }}>
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                {error && <div style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-black"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                >
                    {isPending ? "Logging in..." : "LOGIN"}
                </button>
            </form>

            <div style={{ margin: '20px 0', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>Or continue with</div>

            <button
                type="button"
                onClick={() => signIn("google")}
                style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                }}
            >
                <span style={{ fontSize: '1.2rem' }}>G</span> Google
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                Don't have an account? <Link href="/auth/register" style={{ fontWeight: 700 }}>Sign Up</Link>
            </div>
        </div>
    );
}
