import ResetForm from "@/components/auth/reset-form";
import Navbar from "@/components/Navbar";

export default function ResetPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />
            <div style={{ paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
                <ResetForm />
            </div>
        </main>
    );
}
