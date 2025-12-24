import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <main style={{ background: '#f8fafc', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, paddingTop: 'calc(120px + env(safe-area-inset-top))', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '32px', color: '#111827' }}>Terms of Service</h1>
                    <p style={{ color: '#6b7280', marginBottom: '32px' }}>Last Updated: December 22, 2025</p>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>1. Acceptance of Terms</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            By accessing and using the Liberty Meal Prep website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>2. Services & Ordering</h2>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            <li>**Deadlines:** Orders must be placed by 9:00 PM on Wednesday for Sunday delivery. Late orders may not be fulfilled.</li>
                            <li>**Minimums:** A minimum order of 10 meals is required for delivery orders.</li>
                            <li>**Availability:** All menu items are subject to availability. We reserve the right to limit quantities or discontinue items.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>3. Delivery</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            Deliveries occur on Sundays between 8:00 AM and 12:00 PM.
                        </p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            <li>You are responsible for providing accurate delivery instructions.</li>
                            <li>Meals are delivered in insulated bags with ice packs, but you should refrigerate them immediately upon receipt.</li>
                            <li>We are not responsible for spoilage if you are not available to receive the delivery within the specified window.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>4. Payments & Refunds</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            Payments are processed securely at the time of order via Square or Stripe.
                        </p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            <li>**Cancellations:** Orders may be cancelled for a full refund if requested before the Wednesday 9:00 PM cutoff.</li>
                            <li>**Refunds:** If you are dissatisfied with a meal due to quality issues, please contact us within 24 hours of delivery for a resolution (replacement or refund).</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>5. Food Safety</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            Our meals are prepared in a commercial kitchen following strict health and safety guidelines. However, our kitchen processes nuts, gluten, dairy, and other allergens. We cannot guarantee that any meal is completely allergen-free.
                        </p>
                        <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
                            Meals should be refrigerated at 41°F or below and consumed within 5-6 days.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>6. Governing Law</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
                            These terms are governed by the laws of the State of Arizona.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
