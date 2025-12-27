import LoginForm from "@/components/auth/login-form";
import Navbar from "@/components/Navbar";
import { tokens } from "@/lib/design-tokens";

export default function LoginPage() {
    return (
        <main style={{ minHeight: '100dvh', background: tokens.colors.background }}>
            <Navbar />
            <div style={{ paddingTop: 'calc(80px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 80px)', paddingBottom: '40px' }}>
                <LoginForm />
            </div>
        </main>
    );
}
