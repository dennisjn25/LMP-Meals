import RegisterForm from "@/components/auth/register-form";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
    return (
        <main style={{ minHeight: '100dvh', background: '#f8fafc' }}>
            <Navbar />
            <div style={{ paddingTop: 'calc(80px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 80px)' }}>
                <RegisterForm />
            </div>
        </main>
    );
}
