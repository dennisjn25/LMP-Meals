import { PrismaClient } from '../src/generated/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Path to the customers data file
const DATA_FILE = path.join(process.cwd(), 'scripts', 'seed-data', 'customers.json');

interface CustomerData {
    name: string;
    email: string;
    role: string;
    password: string;
    emailVerified: boolean;
    sendReceiptEmail: boolean;
}

async function main() {
    console.log('🌱 Seeding customers from JSON data...');
    console.log(`   Reading from: ${DATA_FILE}`);

    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ Error: customers.json not found!');
        process.exit(1);
    }

    const customersData: CustomerData[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    console.log(`\n📊 Found ${customersData.length} customers to seed\n`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const customer of customersData) {
        try {
            // Check if customer already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: customer.email }
            });

            if (existingUser) {
                // Update existing user if needed
                const needsUpdate =
                    existingUser.role !== customer.role ||
                    existingUser.name !== customer.name ||
                    existingUser.sendReceiptEmail !== customer.sendReceiptEmail;

                if (needsUpdate) {
                    await prisma.user.update({
                        where: { email: customer.email },
                        data: {
                            name: customer.name,
                            role: customer.role,
                            sendReceiptEmail: customer.sendReceiptEmail,
                            emailVerified: customer.emailVerified ? new Date() : null,
                        }
                    });
                    console.log(`✏️  Updated: ${customer.name} (${customer.email})`);
                    console.log(`   Role: ${customer.role}`);
                    updated++;
                } else {
                    console.log(`⏭️  Skipped: ${customer.name} (${customer.email}) - already exists`);
                    skipped++;
                }
            } else {
                // Hash the password
                const hashedPassword = await bcrypt.hash(customer.password, 10);

                // Create new customer
                const newUser = await prisma.user.create({
                    data: {
                        email: customer.email,
                        name: customer.name,
                        password: hashedPassword,
                        role: customer.role,
                        emailVerified: customer.emailVerified ? new Date() : null,
                        sendReceiptEmail: customer.sendReceiptEmail,
                    }
                });

                console.log(`✅ Created: ${newUser.name} (${newUser.email})`);
                console.log(`   Role: ${newUser.role}`);
                created++;
            }
        } catch (error) {
            console.error(`❌ Error processing ${customer.email}:`, error);
        }
    }

    console.log(`\n🎉 Seeding complete!`);
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ✏️  Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${customersData.length}`);

    // Show admin credentials
    const adminUsers = customersData.filter(c => c.role === 'ADMIN');
    if (adminUsers.length > 0) {
        console.log(`\n🔐 Admin Credentials:`);
        adminUsers.forEach(admin => {
            console.log(`   Email: ${admin.email}`);
            console.log(`   Password: ${admin.password}`);
        });
        console.log(`\n⚠️  IMPORTANT: Change admin passwords after first login!`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding customers:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
