import ResetForm from "@/components/auth/reset-form";
import Navbar from "@/components/Navbar";

export default function ResetPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />
            <div style={{ paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
                <ResetForm />
            </div>
        </main>
    );
}
