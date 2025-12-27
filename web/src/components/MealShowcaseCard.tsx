
import Image from "next/image";
import { tokens } from "@/lib/design-tokens";

export default function MealShowcaseCard({ image, title, description, tag }: { image: string, title: string, description: string, tag: string }) {
    return (
        <div style={{
            background: tokens.colors.surface.light,
            borderRadius: tokens.radius.xl,
            overflow: 'hidden',
            boxShadow: tokens.shadows.md,
            transition: tokens.transitions.normal,
            cursor: 'pointer',
            position: 'relative',
            height: '100%',
            width: '100%',
            border: `1px solid ${tokens.colors.border.light}`
        }}
            className="meal-showcase-card"
        >
            <div style={{ position: 'relative', height: '220px', background: tokens.colors.surface.medium }}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: tokens.spacing.md,
                    right: tokens.spacing.md,
                    background: tokens.colors.accent.DEFAULT, // Fallback or gradient start
                    backgroundImage: `linear-gradient(135deg, ${tokens.colors.accent.light} 0%, ${tokens.colors.accent.DEFAULT} 100%)`,
                    color: '#000',
                    padding: '6px 12px',
                    borderRadius: tokens.radius.full,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    zIndex: 2,
                    boxShadow: tokens.shadows.glow
                }}>
                    {tag}
                </div>
            </div>
            <div style={{ padding: tokens.spacing.lg }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: tokens.spacing.sm, fontFamily: 'var(--font-heading)', fontWeight: 700, color: tokens.colors.text.primary }}>{title}</h3>
                <p style={{ color: tokens.colors.text.secondary, fontSize: '0.9rem' }}>{description}</p>
            </div>
        </div>
    );
}
