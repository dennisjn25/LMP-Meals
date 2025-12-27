import { tokens } from "@/lib/design-tokens";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    fullWidth = true,
    style,
    disabled,
    ...props
}, ref) => {

    return (
        <div style={{ width: fullWidth ? '100%' : 'auto', marginBottom: tokens.spacing.md }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: tokens.spacing.sm,
                    fontSize: '0.9rem',
                    color: tokens.colors.text.secondary,
                    fontWeight: 500
                }}>
                    {label}
                </label>
            )}
            <input
                ref={ref}
                disabled={disabled}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: tokens.radius.md,
                    border: `1px solid ${error ? tokens.colors.text.error : tokens.colors.border.light}`,
                    background: disabled ? '#f3f4f6' : '#fff',
                    outline: 'none',
                    fontSize: '1rem',
                    transition: tokens.transitions.fast,
                    color: '#000000',
                    ...style
                }}
                onFocus={(e) => {
                    if (!error && !disabled) e.currentTarget.style.borderColor = tokens.colors.primary.DEFAULT;
                }}
                onBlur={(e) => {
                    if (!error && !disabled) e.currentTarget.style.borderColor = tokens.colors.border.light;
                }}
                {...props}
            />
            {error && (
                <span style={{
                    display: 'block',
                    marginTop: tokens.spacing.xs,
                    color: tokens.colors.text.error,
                    fontSize: '0.85rem'
                }}>
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = "Input";
