"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitContactForm } from "@/actions/contact";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        const formData = new FormData(e.currentTarget);

        try {
            const result = await submitContactForm(formData);

            if (result.success) {
                setStatus({ type: 'success', message: result.message });
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus({ type: 'error', message: result.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main style={{ minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', maxWidth: '1200px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px', textAlign: 'center' }}>Get In Touch</h1>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '60px', fontSize: '1.1rem' }}>
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    {/* Contact Form */}
                    <div className="glass-panel" style={{ padding: '40px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Send us a message</h2>

                        {status.type && (
                            <div style={{
                                padding: '16px',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: status.type === 'success' ? '#d1fae5' : '#fee2e2',
                                border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`,
                                color: status.type === 'success' ? '#065f46' : '#991b1b'
                            }}>
                                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <span>{status.message}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                            <div>
                                <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Name *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    disabled={isSubmitting}
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    disabled={isSubmitting}
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    disabled={isSubmitting}
                                    className="input-field"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        minHeight: '150px',
                                        fontSize: '1rem',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-black"
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    opacity: isSubmitting ? 0.6 : 1,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid #fff',
                                            borderTopColor: 'transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 0.6s linear infinite'
                                        }} />
                                        SENDING...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        SEND MESSAGE
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="glass-panel" style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    background: '#000',
                                    color: '#fff',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    flexShrink: 0
                                }}>
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Email Us</h3>
                                    <a href="mailto:justin@lmpmeals.com" style={{ color: '#10b981', fontSize: '0.95rem' }}>
                                        justin@lmpmeals.com
                                    </a>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                                        We'll respond within 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    background: '#000',
                                    color: '#fff',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    flexShrink: 0
                                }}>
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Call Us</h3>
                                    <a href="tel:+16028914619" style={{ color: '#10b981', fontSize: '0.95rem' }}>
                                        602-891-4619
                                    </a>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                                        Mon-Fri, 9AM - 5PM MST
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    background: '#000',
                                    color: '#fff',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    flexShrink: 0
                                }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Visit Us</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                        Scottsdale, AZ 85251
                                    </p>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                                        Serving within 25 miles
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '32px', background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)', color: '#fff' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Business Hours</h3>
                            <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#d1d5db' }}>Monday - Friday</span>
                                    <span style={{ fontWeight: 600 }}>9AM - 5PM</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#d1d5db' }}>Saturday</span>
                                    <span style={{ fontWeight: 600 }}>10AM - 2PM</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#d1d5db' }}>Sunday</span>
                                    <span style={{ fontWeight: 600 }}>Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <Footer />
        </main>
    );
}
