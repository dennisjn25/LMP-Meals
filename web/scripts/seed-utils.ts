/**
 * Seeding Utility Functions
 * 
 * Helper functions for generating realistic test data
 */

// Random number between min and max (inclusive)
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random float between min and max
export function randomFloat(min: number, max: number, decimals: number = 2): number {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
}

// Random boolean with probability (0-100)
export function randomBoolean(probability: number = 50): boolean {
    return Math.random() * 100 < probability;
}

// Random element from array
export function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length - 1)];
}

// Random date between start and end
export function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate random phone number
export function randomPhone(): string {
    const area = randomInt(200, 999);
    const prefix = randomInt(200, 999);
    const line = randomInt(1000, 9999);
    return `(${area}) ${prefix}-${line}`;
}

// Generate random zip code
export function randomZipCode(): string {
    return randomInt(10000, 99999).toString();
}

// Generate unique order number (LMP-XXXXXX)
export function generateOrderNumber(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
    let result = 'LMP-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(randomInt(0, chars.length - 1));
    }
    return result;
}

// Generate unique product ID (8-digit starting with 7)
export function generateProductId(): string {
    return '7' + randomInt(1000000, 9999999).toString();
}

// First names
const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
    'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
    'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
    'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
    'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
    'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
    'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
    'Alexander', 'Rachel', 'Patrick', 'Catherine', 'Frank', 'Carolyn', 'Jack', 'Janet',
    'Dennis', 'Ruth', 'Jerry', 'Maria', 'Tyler', 'Heather', 'Aaron', 'Diane',
];

// Last names
const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
    'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
    'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
    'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
];

// Generate random name
export function randomName(): string {
    return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
}

// Generate random email from name
export function generateEmail(name: string, domain: string = 'example.com'): string {
    const normalized = name.toLowerCase().replace(/\s+/g, '.');
    const random = randomInt(1, 999);
    return `${normalized}${random > 100 ? random : ''}@${domain}`;
}

// Street names
const streetNames = [
    'Main', 'Oak', 'Maple', 'Cedar', 'Elm', 'Washington', 'Lake', 'Hill',
    'Park', 'Pine', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sunset',
    'Lincoln', 'Madison', 'Jackson', 'Church', 'Spring', 'River', 'Market', 'Broad',
];

// Street types
const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Rd', 'Way', 'Ct'];

// Generate random address
export function randomAddress(): string {
    const number = randomInt(100, 9999);
    const street = randomElement(streetNames);
    const type = randomElement(streetTypes);
    return `${number} ${street} ${type}`;
}

// Cities
const cities = [
    'Springfield', 'Riverside', 'Franklin', 'Greenville', 'Bristol', 'Clinton',
    'Fairview', 'Salem', 'Madison', 'Georgetown', 'Arlington', 'Marion',
    'Ashland', 'Oxford', 'Clayton', 'Jackson', 'Burlington', 'Manchester',
    'Milton', 'Newport', 'Auburn', 'Dayton', 'Lexington', 'Milford',
];

// Generate random city
export function randomCity(): string {
    return randomElement(cities);
}

// Order statuses with realistic distribution
export function randomOrderStatus(percentagePaid: number, percentageCompleted: number): string {
    const rand = Math.random() * 100;

    if (rand < percentageCompleted) {
        return randomElement(['COMPLETED', 'DELIVERED']);
    } else if (rand < percentagePaid) {
        return 'PAID';
    } else {
        return randomElement(['PENDING', 'CANCELLED']);
    }
}

// Delivery statuses with realistic distribution
export function randomDeliveryStatus(percentageDelivered: number, percentageInProgress: number): string {
    const rand = Math.random() * 100;

    if (rand < percentageDelivered) {
        return 'DELIVERED';
    } else if (rand < percentageDelivered + percentageInProgress) {
        return 'IN_PROGRESS';
    } else {
        return randomElement(['PENDING', 'FAILED']);
    }
}

// Employee positions by department
export const employeePositions = {
    Kitchen: ['Head Chef', 'Sous Chef', 'Line Cook', 'Prep Cook', 'Dishwasher'],
    Logistics: ['Delivery Driver', 'Route Manager', 'Warehouse Manager', 'Inventory Specialist'],
    Administration: ['Office Manager', 'Customer Service Rep', 'Accountant', 'HR Manager'],
    Sales: ['Sales Manager', 'Account Executive', 'Marketing Coordinator'],
};

// Get random position for department
export function randomPosition(department: keyof typeof employeePositions): string {
    return randomElement(employeePositions[department]);
}

// Promo code generators
export function generatePromoCode(length: number = 8): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(randomInt(0, chars.length - 1));
    }
    return result;
}

// Progress bar for console output
export function progressBar(current: number, total: number, label: string = ''): string {
    const percentage = Math.floor((current / total) * 100);
    const filled = Math.floor(percentage / 2);
    const empty = 50 - filled;

    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `${label} [${bar}] ${percentage}% (${current}/${total})`;
}

// Format duration
export function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Batch processor to avoid memory issues
export async function processBatch<T, R>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<R[]>,
    onProgress?: (current: number, total: number) => void
): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await processor(batch);
        results.push(...batchResults);

        if (onProgress) {
            onProgress(Math.min(i + batchSize, items.length), items.length);
        }
    }

    return results;
}

// Generate realistic coordinates (US-based)
export function randomCoordinates(): { latitude: number; longitude: number } {
    // Approximate US bounds
    const latitude = randomFloat(25.0, 49.0, 6);
    const longitude = randomFloat(-125.0, -66.0, 6);
    return { latitude, longitude };
}

// Generate delivery notes
const deliveryNotes = [
    'Left at front door',
    'Handed to customer',
    'Left with neighbor',
    'Left in mailroom',
    'Customer not home - left in safe location',
    'Delivered to reception',
    'Left at side entrance',
    'Customer requested contactless delivery',
];

export function randomDeliveryNote(): string {
    return randomElement(deliveryNotes);
}
