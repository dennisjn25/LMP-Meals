import LoginForm from "@/components/auth/login-form";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />
            <div style={{ paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
                <LoginForm />
            </div>
        </main>
    );
}
