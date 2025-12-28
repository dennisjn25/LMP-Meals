// Liberty Meal Prep Design System
// Matching the lmpmeals.com website aesthetic

export const theme = {
    colors: {
        // Background colors matching website
        background: '#0B0E14', // Dark Navy/Black
        surface: '#1e293b', // Deep Blue/Slate
        surfaceHighlight: '#334155', // Lighter slate

        text: {
            primary: '#ffffff', // White text
            secondary: '#94a3b8', // Slate 400
            muted: '#64748b', // Slate 500
        },

        // Accent color from website
        primary: '#fbbf24', // Golden/Amber accent
        primaryHover: '#f59e0b', // Darker amber on hover
        primaryLight: 'rgba(251, 191, 36, 0.1)', // Light amber background

        // Status colors
        success: '#10b981', // Green
        warning: '#f59e0b', // Amber
        error: '#ef4444', // Red

        // Border colors
        border: 'rgba(255, 255, 255, 0.1)', // Light transparent
        borderMedium: 'rgba(255, 255, 255, 0.15)',
        borderDark: 'rgba(255, 255, 255, 0.05)',
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },

    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
    },

    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            elevation: 8,
        }
    },

    fonts: {
        heading: 'System', // Will use system font similar to Oswald weight
        body: 'System',
    }
};
