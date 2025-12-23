export default function ButtonDemo() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '48px',
            padding: '40px'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{
                    color: '#fff',
                    fontSize: '3rem',
                    marginBottom: '16px',
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                }}>
                    Modern CTA Buttons
                </h1>
                <p style={{
                    color: '#cbd5e1',
                    fontSize: '1.2rem',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Featuring sleek, rounded rectangular forms with subtle gradient neon glow outlines
                </p>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Primary Button (.btn-black)
                    </p>
                    <button className="btn-black">
                        Start Your Journey
                    </button>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Outline Button (.btn-outline)
                    </p>
                    <button className="btn-outline">
                        Learn More
                    </button>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Multiple Buttons
                    </p>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button className="btn-black">Browse Menu</button>
                        <button className="btn-black">Order Now</button>
                        <button className="btn-outline">Contact Us</button>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '40px',
                padding: '32px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '700px'
            }}>
                <h2 style={{
                    color: '#fff',
                    fontSize: '1.5rem',
                    marginBottom: '16px',
                    fontFamily: 'var(--font-heading)'
                }}>
                    Features
                </h2>
                <ul style={{
                    color: '#cbd5e1',
                    lineHeight: '1.8',
                    listStyle: 'none',
                    padding: 0
                }}>
                    <li>✨ Gradient neon glow outline (gray to white)</li>
                    <li>🎨 Smooth hover animations with lift effect</li>
                    <li>💫 Pulsing glow animation on hover</li>
                    <li>⚡ Shimmer effect on hover</li>
                    <li>🌟 Modern, futuristic aesthetic</li>
                    <li>📱 Responsive and accessible</li>
                </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
                <a href="/" className="btn-outline">
                    ← Back to Home
                </a>
            </div>
        </div>
    );
}
