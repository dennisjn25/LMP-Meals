import RegisterForm from "@/components/auth/register-form";
import Navbar from "@/components/Navbar";

import { tokens } from "@/lib/design-tokens";

export default function RegisterPage() {
    return (
        <main style={{ minHeight: '100dvh', background: tokens.colors.background }}>
            <Navbar />
            <div style={{ paddingTop: 'calc(120px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 120px)' }}>
                <RegisterForm />
            </div>
        </main>
    );
}
