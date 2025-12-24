import LoginForm from "@/components/auth/login-form";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    return (
        <main style={{ minHeight: '100dvh', background: '#f8fafc' }}>
            <Navbar />
            <div style={{ paddingTop: 'calc(80px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 80px)' }}>
                <LoginForm />
            </div>
        </main>
    );
}
