export const tokens = {
    colors: {
        primary: {
            DEFAULT: '#000000',
            inverse: '#ffffff',
            hover: '#1a1a1a',
        },
        background: '#f8f9fa',
        accent: {
            DEFAULT: '#fbbf24', // Amber 400
            light: 'rgba(251, 191, 36, 0.1)', // Amber 400 with opacity
            hover: '#f59e0b', // Amber 500
        },
        surface: {
            light: 'rgba(255, 255, 255, 0.03)',
            medium: 'rgba(255, 255, 255, 0.05)',
            dark: '#0B0E14',
            glass: 'rgba(255, 255, 255, 0.95)',
        },
        text: {
            primary: '#000000',
            secondary: '#64748b', // Slate 500 - Better contrast
            inverse: '#ffffff',
            inverseSecondary: '#94a3b8', // Slate 400
            error: '#ef4444',
            success: '#10b981',
        },
        border: {
            light: '#e5e7eb',
            dark: 'rgba(255, 255, 255, 0.08)',
        }
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },
    radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        glow: '0 0 15px rgba(251, 191, 36, 0.4)',
    },
    transitions: {
        fast: 'all 0.2s ease',
        normal: 'all 0.3s ease',
    }
} as const;
