/**
 * Seeding Configuration
 * 
 * This file contains all configuration options for database seeding.
 * Adjust these values based on your testing needs.
 */

export interface SeedConfig {
    // Volume settings
    volumes: {
        customers: number;
        employees: number;
        meals: number;
        orders: number;
        promoCodes: number;
        deliveries: number;
        routes: number;
    };

    // Date range for historical data
    dateRange: {
        startDate: Date;
        endDate: Date;
    };

    // Order settings
    orders: {
        minItemsPerOrder: number;
        maxItemsPerOrder: number;
        minQuantityPerItem: number;
        maxQuantityPerItem: number;
        percentageWithDelivery: number; // 0-100
        percentagePaid: number; // 0-100
        percentageCompleted: number; // 0-100
    };

    // Delivery settings
    deliveries: {
        percentageDelivered: number; // 0-100
        percentageInProgress: number; // 0-100
        percentageWithProof: number; // 0-100 (signature/photo)
    };

    // Route settings
    routes: {
        minDeliveriesPerRoute: number;
        maxDeliveriesPerRoute: number;
        percentageOptimized: number; // 0-100
    };

    // Environment safety
    environment: {
        allowProduction: boolean;
        requireConfirmation: boolean;
    };
}

// Development configuration (large dataset for testing)
export const developmentConfig: SeedConfig = {
    volumes: {
        customers: 1000,
        employees: 50,
        meals: 100,
        orders: 5000,
        promoCodes: 50,
        deliveries: 3000,
        routes: 200,
    },
    dateRange: {
        startDate: new Date('2024-01-01'),
        endDate: new Date(),
    },
    orders: {
        minItemsPerOrder: 1,
        maxItemsPerOrder: 8,
        minQuantityPerItem: 1,
        maxQuantityPerItem: 5,
        percentageWithDelivery: 60,
        percentagePaid: 80,
        percentageCompleted: 70,
    },
    deliveries: {
        percentageDelivered: 75,
        percentageInProgress: 15,
        percentageWithProof: 80,
    },
    routes: {
        minDeliveriesPerRoute: 5,
        maxDeliveriesPerRoute: 20,
        percentageOptimized: 70,
    },
    environment: {
        allowProduction: false,
        requireConfirmation: true,
    },
};

// Small configuration (quick testing)
export const smallConfig: SeedConfig = {
    volumes: {
        customers: 50,
        employees: 10,
        meals: 30,
        orders: 200,
        promoCodes: 10,
        deliveries: 120,
        routes: 20,
    },
    dateRange: {
        startDate: new Date('2024-11-01'),
        endDate: new Date(),
    },
    orders: {
        minItemsPerOrder: 1,
        maxItemsPerOrder: 5,
        minQuantityPerItem: 1,
        maxQuantityPerItem: 3,
        percentageWithDelivery: 60,
        percentagePaid: 80,
        percentageCompleted: 70,
    },
    deliveries: {
        percentageDelivered: 75,
        percentageInProgress: 15,
        percentageWithProof: 80,
    },
    routes: {
        minDeliveriesPerRoute: 3,
        maxDeliveriesPerRoute: 10,
        percentageOptimized: 70,
    },
    environment: {
        allowProduction: false,
        requireConfirmation: false,
    },
};

// Minimal configuration (basic testing)
export const minimalConfig: SeedConfig = {
    volumes: {
        customers: 10,
        employees: 5,
        meals: 15,
        orders: 30,
        promoCodes: 5,
        deliveries: 20,
        routes: 5,
    },
    dateRange: {
        startDate: new Date('2024-12-01'),
        endDate: new Date(),
    },
    orders: {
        minItemsPerOrder: 1,
        maxItemsPerOrder: 3,
        minQuantityPerItem: 1,
        maxQuantityPerItem: 2,
        percentageWithDelivery: 50,
        percentagePaid: 70,
        percentageCompleted: 60,
    },
    deliveries: {
        percentageDelivered: 70,
        percentageInProgress: 20,
        percentageWithProof: 60,
    },
    routes: {
        minDeliveriesPerRoute: 2,
        maxDeliveriesPerRoute: 5,
        percentageOptimized: 50,
    },
    environment: {
        allowProduction: false,
        requireConfirmation: false,
    },
};

// Get configuration based on environment variable or default
export function getConfig(): SeedConfig {
    const configType = process.env.SEED_CONFIG || 'minimal';

    switch (configType.toLowerCase()) {
        case 'development':
        case 'dev':
            return developmentConfig;
        case 'small':
            return smallConfig;
        case 'minimal':
        case 'min':
            return minimalConfig;
        default:
            console.warn(`Unknown config type: ${configType}, using minimal`);
            return minimalConfig;
    }
}

// Check if current environment is safe for seeding
export function checkEnvironmentSafety(): boolean {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const databaseUrl = process.env.DATABASE_URL || '';

    // Check if production
    const isProduction = nodeEnv === 'production' ||
        databaseUrl.includes('prod') ||
        databaseUrl.includes('production');

    if (isProduction) {
        console.error('\n❌ PRODUCTION ENVIRONMENT DETECTED!\n');
        console.error('Seeding is disabled in production for safety.');
        console.error('If you really need to seed production data:');
        console.error('1. Set ALLOW_PRODUCTION_SEED=true in environment');
        console.error('2. Ensure you have a recent backup');
        console.error('3. Understand the risks\n');

        return process.env.ALLOW_PRODUCTION_SEED === 'true';
    }

    return true;
}
