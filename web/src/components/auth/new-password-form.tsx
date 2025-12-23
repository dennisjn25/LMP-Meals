"use client";

import { useTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword, verifyResetToken } from "@/actions/password-reset";
import { Loader2 } from "lucide-react";

const NewPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function NewPasswordForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [isValidating, setIsValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    // Verify token on mount
    useEffect(() => {
        if (!token) {
            setError("Missing reset token!");
            setIsValidating(false);
            return;
        }

        verifyResetToken(token).then((data) => {
            setIsValidating(false);
            if (data?.error) {
                setError(data.error);
                setTokenValid(false);
            } else {
                setTokenValid(true);
            }
        });
    }, [token]);

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        if (!token) {
            setError("Missing reset token!");
            return;
        }

        setError("");
        setSuccess("");

        startTransition(() => {
            resetPassword({ password: values.password, token }).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
                if (data?.success) {
                    setSuccess(data.success);
                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 2000);
                }
            });
        });
    };

    if (isValidating) {
        return (
            <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                <Loader2 className="animate-spin" style={{ margin: '0 auto', marginBottom: '20px' }} size={40} />
                <p>Verifying reset token...</p>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem', color: '#ef4444' }}>Invalid Token</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#6b7280' }}>
                    {error || "This password reset link is invalid or has expired."}
                </p>
                <Link href="/auth/reset" className="btn-black" style={{ width: '100%', textAlign: 'center', justifyContent: 'center', display: 'flex' }}>
                    Request New Reset Link
                </Link>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem' }}>SET NEW PASSWORD</h2>

            <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>New Password</label>
                    <input
                        {...form.register("password")}
                        type="password"
                        disabled={isPending}
                        placeholder="Enter new password"
                        style={{ width: '100%', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    />
                    {form.formState.errors.password && (
                        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>
                            {form.formState.errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>Confirm Password</label>
                    <input
                        {...form.register("confirmPassword")}
                        type="password"
                        disabled={isPending}
                        placeholder="Confirm new password"
                        style={{ width: '100%', padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    />
                    {form.formState.errors.confirmPassword && (
                        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>
                            {form.formState.errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', padding: '12px', background: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
                {success && <div style={{ color: '#10b981', fontSize: '0.9rem', textAlign: 'center', padding: '12px', background: '#d1fae5', borderRadius: '4px' }}>{success}</div>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-black"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                >
                    {isPending ? "Updating password..." : "RESET PASSWORD"}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                <Link href="/auth/login" style={{ fontWeight: 700 }}>Back to Login</Link>
            </div>
        </div>
    );
}
