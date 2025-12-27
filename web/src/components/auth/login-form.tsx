"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/actions/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { tokens } from "@/lib/design-tokens";

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
                } else if (data?.success && data?.redirect) {
                    window.location.href = data.redirect;
                }
            });
        });
    };

    return (
        <Card glass style={{ maxWidth: '450px', width: '100%', margin: '0 auto', border: `1px solid ${tokens.colors.border.light}` }}>
            <CardHeader style={{ textAlign: 'center', marginBottom: '24px' }}>
                <CardTitle style={{ fontSize: '1.75rem' }}>WELCOME BACK</CardTitle>
                <div style={{ color: tokens.colors.text.secondary, fontSize: '0.9rem' }}>Sign in to manage your meal prep</div>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Input
                        label="Email"
                        type="email"
                        disabled={isPending}
                        error={form.formState.errors.email?.message}
                        placeholder="you@example.com"
                        {...form.register("email")}
                    />

                    <div>
                        <Input
                            label="Password"
                            type="password"
                            disabled={isPending}
                            error={form.formState.errors.password?.message}
                            placeholder="••••••••"
                            {...form.register("password")}
                        />
                        <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '16px' }}>
                            <Link href="/auth/reset" style={{ fontSize: '0.8rem', color: tokens.colors.text.primary, textDecoration: 'underline' }}>
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#dc2626',
                            fontSize: '0.9rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontWeight: 500
                        }}>
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        isLoading={isPending}
                        fullWidth
                        size="lg"
                    >
                        LOGIN
                    </Button>
                </form>



                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: tokens.colors.text.secondary }}>
                    Don't have an account? <Link href="/auth/register" style={{ fontWeight: 700, color: tokens.colors.text.primary }}>Sign Up</Link>
                </div>
            </CardContent>
        </Card>
    );
}

