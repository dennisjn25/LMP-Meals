"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register } from "@/actions/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { tokens } from "@/lib/design-tokens";

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Minimum 6 characters"),
    phone: z.string().optional(),
    deliveryAddress: z.string().optional(),
    deliveryCity: z.string().optional(),
    deliveryState: z.string().optional(),
    deliveryZip: z.string().optional(),
    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingState: z.string().optional(),
    billingZip: z.string().optional(),
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
            phone: "",
            deliveryAddress: "",
            deliveryCity: "",
            deliveryState: "Arizona",
            deliveryZip: "",
            billingAddress: "",
            billingCity: "",
            billingState: "Arizona",
            billingZip: "",
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
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/auth/login';
                    }, 2000);
                }
            });
        });
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.05)',
        borderColor: tokens.colors.border.light,
        color: 'white'
    };

    return (
        <Card glass style={{ maxWidth: '600px', width: '100%', margin: '0 auto', border: `1px solid ${tokens.colors.border.light}` }}>
            <CardHeader style={{ textAlign: 'center', marginBottom: '24px' }}>
                <CardTitle style={{ fontSize: '1.75rem', color: 'white' }}>CREATE ACCOUNT</CardTitle>
                <div style={{ color: tokens.colors.text.secondary, fontSize: '0.9rem' }}>Join Liberty Meal Prep today</div>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        disabled={isPending}
                        error={form.formState.errors.name?.message}
                        style={inputStyle}
                        {...form.register("name")}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        disabled={isPending}
                        error={form.formState.errors.email?.message}
                        style={inputStyle}
                        {...form.register("email")}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        disabled={isPending}
                        error={form.formState.errors.password?.message}
                        style={inputStyle}
                        {...form.register("password")}
                    />
                    <Input
                        label="Phone Number (Optional)"
                        placeholder="(555) 123-4567"
                        disabled={isPending}
                        style={inputStyle}
                        {...form.register("phone")}
                    />

                    <div style={{ margin: '20px 0', borderTop: `1px solid ${tokens.colors.border.light}`, paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: tokens.colors.accent.DEFAULT, fontFamily: 'var(--font-heading)' }}>Delivery Address (Optional)</h3>
                        <Input
                            placeholder="Street Address"
                            disabled={isPending}
                            style={inputStyle}
                            {...form.register("deliveryAddress")}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Input
                                placeholder="City"
                                disabled={isPending}
                                style={inputStyle}
                                {...form.register("deliveryCity")}
                            />
                            <Input
                                placeholder="Zip Code"
                                disabled={isPending}
                                style={inputStyle}
                                {...form.register("deliveryZip")}
                            />
                        </div>
                        <Input
                            value="Arizona"
                            disabled
                            style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }}
                            {...form.register("deliveryState")}
                        />
                    </div>

                    <div style={{ margin: '0 0 20px 0', borderTop: `1px solid ${tokens.colors.border.light}`, paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: tokens.colors.accent.DEFAULT, fontFamily: 'var(--font-heading)' }}>Billing Address (Optional)</h3>
                        <Input
                            placeholder="Street Address"
                            disabled={isPending}
                            style={inputStyle}
                            {...form.register("billingAddress")}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Input
                                placeholder="City"
                                disabled={isPending}
                                style={inputStyle}
                                {...form.register("billingCity")}
                            />
                            <Input
                                placeholder="Zip Code"
                                disabled={isPending}
                                style={inputStyle}
                                {...form.register("billingZip")}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            fontSize: '0.9rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontWeight: 600,
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div style={{
                            padding: '12px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            fontSize: '0.9rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontWeight: 600,
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            {success}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        isLoading={isPending}
                        fullWidth
                        size="lg"
                        style={{ marginTop: '16px' }}
                    >
                        SIGN UP
                    </Button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: tokens.colors.text.secondary }}>
                    Already have an account? <Link href="/auth/login" style={{ fontWeight: 700, color: tokens.colors.accent.DEFAULT }}>Log In</Link>
                </div>
            </CardContent>
        </Card>
    );
}
