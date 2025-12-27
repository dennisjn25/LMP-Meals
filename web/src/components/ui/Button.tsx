import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { tokens } from '@/lib/design-tokens';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    children,
    disabled,
    style,
    ...props
}, ref) => {

    // Base styles
    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: tokens.radius.lg, // 12px
        fontWeight: 700,
        fontFamily: 'var(--font-heading)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: '2px solid transparent',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.7 : 1,
        transition: tokens.transitions.fast,
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
        ...style
    };

    // Variant styles
    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
        secondary: {
            background: tokens.colors.accent.DEFAULT,
            color: 'black',
            border: `2px solid ${tokens.colors.accent.DEFAULT}`,
        },
        outline: {
            background: 'transparent',
            border: '2px solid rgba(0,0,0,0.1)',
            color: 'black',
        },
        ghost: {
            background: 'transparent',
            color: 'inherit',
            boxShadow: 'none',
            paddingLeft: tokens.spacing.sm,
            paddingRight: tokens.spacing.sm,
        },
        danger: {
            background: tokens.colors.text.error,
            color: 'white',
        }
    };

    // Size styles
    const sizeStyles: Record<string, React.CSSProperties> = {
        sm: {
            padding: '8px 16px',
            fontSize: '0.8rem',
            height: '32px',
        },
        md: {
            padding: '12px 24px',
            fontSize: '0.9rem',
            height: '44px',
        },
        lg: {
            padding: '16px 32px',
            fontSize: '1rem',
            height: '56px',
        }
    };

    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            style={{ ...baseStyles, ...variantStyles[variant], ...sizeStyles[size], ...style }}
            {...props}
            onMouseOver={(e) => {
                if (disabled || isLoading) return;

                if (variant === 'primary') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                } else if (variant === 'outline') {
                    e.currentTarget.style.borderColor = 'black';
                    e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                } else if (variant === 'danger') {
                    e.currentTarget.style.background = '#dc2626';
                }
            }}
            onMouseOut={(e) => {
                if (disabled || isLoading) return;

                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = variant === 'primary' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none';

                if (variant === 'primary') {
                    // Reset primary styles ? 
                    // Actually inline styles persist, so we rely on React re-render or explicit reset.
                    // Ideally use CSS classes for hover states, but sticking to inline for now as requested/pattern matched.
                    // For better maintainability in this "inline-style" world, we set back to initial.
                } else if (variant === 'outline') {
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                    e.currentTarget.style.background = 'transparent';
                } else if (variant === 'danger') {
                    e.currentTarget.style.background = tokens.colors.text.error;
                }
            }}
        >
            {isLoading && <Loader2 className="animate-spin" size={16} style={{ marginRight: '8px' }} />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';
