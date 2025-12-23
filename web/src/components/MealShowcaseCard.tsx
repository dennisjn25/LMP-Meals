
import Image from "next/image";

export default function MealShowcaseCard({ image, title, description, tag }: { image: string, title: string, description: string, tag: string }) {
    return (
        <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            height: '100%',
            width: '100%'
        }}
            className="meal-showcase-card"
        >
            <div style={{ position: 'relative', height: '220px', background: '#f3f4f6' }}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    zIndex: 2,
                    boxShadow: '0 2px 10px rgba(251, 191, 36, 0.4)'
                }}>
                    {tag}
                </div>
            </div>
            <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>{title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{description}</p>
            </div>
        </div>
    );
}
