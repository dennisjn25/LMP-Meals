import Navbar from "@/components/Navbar";
import NewPasswordForm from "@/components/auth/new-password-form";
import { Suspense } from "react";

export default function NewPasswordPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />
            <div style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading...</div>}>
                    <NewPasswordForm />
                </Suspense>
            </div>
        </main>
    );
}
