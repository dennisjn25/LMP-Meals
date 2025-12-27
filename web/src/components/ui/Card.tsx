import { tokens } from "@/lib/design-tokens";

interface CardProps {
    children: React.ReactNode;
    className?: string; // Kept for compatibility if we add classes later
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: React.CSSProperties;
    glass?: boolean;
}

export function Card({ children, padding = 'md', style, glass = false }: CardProps) {

    const paddingMap = {
        none: '0',
        sm: tokens.spacing.sm,
        md: tokens.spacing.lg, // 24px
        lg: tokens.spacing.xl, // 32px
    };

    const cardStyle: React.CSSProperties = {
        background: glass ? tokens.colors.surface.glass : 'white',
        border: `1px solid ${tokens.colors.border.light}`,
        borderRadius: tokens.radius.xl, // 20px
        padding: paddingMap[padding],
        boxShadow: glass ? tokens.shadows.glow : tokens.shadows.sm,
        backdropFilter: glass ? 'blur(10px)' : 'none',
        transition: tokens.transitions.normal,
        ...style
    };

    return (
        <div style={cardStyle}>
            {children}
        </div>
    );
}

export function CardHeader({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
    return (
        <div style={{ marginBottom: tokens.spacing.md, ...style }}>
            {children}
        </div>
    );
}

export function CardTitle({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
    return (
        <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            marginBottom: tokens.spacing.xs,
            ...style
        }}>
            {children}
        </h3>
    );
}

export function CardContent({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
    return <div style={style}>{children}</div>;
}
