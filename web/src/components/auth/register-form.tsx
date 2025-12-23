"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register } from "@/actions/auth";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Minimum 6 characters")
});

export default function RegisterForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values).then((data) => {
                if (data.error) {
                    setError(data.error);
                }
                if (data.success) {
                    setSuccess(data.success);
                }
            });
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem' }}>CREATE ACCOUNT</h2>

            <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>Name</label>
                    <input
                        {...form.register("name")}
                        disabled={isPending}
                        style={{ width: '100%', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    />
                </div>
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
                </div>

                {error && <div style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: 'green', fontSize: '0.9rem', textAlign: 'center' }}>{success}</div>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-black"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                >
                    {isPending ? "Creating Account..." : "SIGN UP"}
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
                Already have an account? <Link href="/auth/login" style={{ fontWeight: 700 }}>Log In</Link>
            </div>
        </div>
    );
}
