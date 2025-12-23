"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Link from "next/link";
// We would import reset logic here

const ResetSchema = z.object({
    email: z.string().email(),
});

export default function ResetForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            import("@/actions/password-reset").then(({ requestPasswordReset }) => {
                requestPasswordReset(values).then((data) => {
                    if (data?.error) {
                        setError(data.error);
                    }
                    if (data?.success) {
                        setSuccess(data.success);
                    }
                });
            });
        });
    };


    return (
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem' }}>RESET PASSWORD</h2>

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

                {error && <div style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: 'green', fontSize: '0.9rem', textAlign: 'center' }}>{success}</div>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-black"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                >
                    {isPending ? "Sending email..." : "SEND RESET LINK"}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                <Link href="/auth/login" style={{ fontWeight: 700 }}>Back to Login</Link>
            </div>
        </div>
    );
}
