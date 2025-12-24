import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
    return (
        <main style={{ background: '#f8fafc', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, paddingTop: 'calc(120px + env(safe-area-inset-top))', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '32px', color: '#111827' }}>Privacy Policy</h1>
                    <p style={{ color: '#6b7280', marginBottom: '32px' }}>Last Updated: December 22, 2025</p>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>1. Information We Collect</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            We collect information you provide directly to us when you create an account, place an order, subscribe to our emails, or contact us. This includes:
                        </p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            <li>Name, email address, phone number, and delivery address.</li>
                            <li>Payment information (processed securely by our third-party payment processors, Stripe and Square).</li>
                            <li>Order history and dietary preferences.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>2. How We Use Your Information</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            We use your information to:
                        </p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            <li>Process and deliver your meal orders.</li>
                            <li>Send order confirmations and delivery updates.</li>
                            <li>Communicate with you about products, services, and promotions (if you opt-in).</li>
                            <li>Improve our website and customer service.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>3. Information Sharing</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            We share your personal information with:
                        </p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            <li>**Service Providers:** Delivery drivers, payment processors (Stripe/Square), and email service providers who help us operate our business.</li>
                            <li>**Legal Requirements:** If required by law or to protect our rights and safety.</li>
                        </ul>
                        <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
                            We do <strong>not</strong> sell or rent your personal information to third parties for marketing purposes.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>4. Security</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            We take reasonable measures to protect your information. Your payment data is tokenized and stored securely by our payment processors; we do not store full credit card numbers on our servers.
                        </p>
                    </section>

                    <section style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>5. Your Rights</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            You can access and update your account information at any time by logging into your account or contacting us. You can opt-out of marketing emails by clicking the "unsubscribe" link in the email.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#374151' }}>6. Contact Us</h2>
                        <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
                            If you have questions about this policy, please contact us via our Contact Page.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
