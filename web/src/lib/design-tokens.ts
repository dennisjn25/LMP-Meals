export const tokens = {
    colors: {
        primary: {
            DEFAULT: '#ffffff',
            inverse: '#000000',
            hover: '#e5e7eb',
        },
        background: '#0B0E14',
        accent: {
            DEFAULT: '#fbbf24', // Amber 400
            light: 'rgba(251, 191, 36, 0.1)', // Amber 400 with opacity
            hover: '#f59e0b', // Amber 500
        },
        surface: {
            light: '#1e293b', // Deep Blue/Slate
            medium: '#0f172a', // Navy
            dark: '#020617', // Near black
            glass: 'rgba(255, 255, 255, 0.05)',
        },
        text: {
            primary: '#ffffff',
            secondary: '#94a3b8', // Slate 400
            inverse: '#000000',
            inverseSecondary: '#475569', // Slate 600
            error: '#ef4444',
            success: '#10b981',
        },
        border: {
            light: 'rgba(255, 255, 255, 0.1)',
            dark: 'rgba(255, 255, 255, 0.05)',
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
        lg: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        glow: '0 0 15px rgba(251, 191, 36, 0.4)',
    },
    transitions: {
        fast: 'all 0.2s ease',
        normal: 'all 0.3s ease',
    }
} as const;

