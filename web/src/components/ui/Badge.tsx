import { tokens } from "@/lib/design-tokens";

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    style?: React.CSSProperties;
}

export function Badge({ children, variant = 'default', style }: BadgeProps) {

    const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
        default: {
            background: '#f3f4f6',
            color: '#1f2937',
        },
        success: {
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#059669',
        },
        warning: {
            background: 'rgba(251, 191, 36, 0.1)',
            color: '#d97706',
        },
        error: {
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
        },
        outline: {
            background: 'transparent',
            border: `1px solid ${tokens.colors.border.light}`,
            color: tokens.colors.text.secondary,
        }
    };

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            ...variantStyles[variant],
            ...style
        }}>
            {children}
        </span>
    );
}
