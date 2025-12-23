import { PrismaClient } from '../src/generated/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔐 Creating admin user...');

    const adminEmail = 'justin@lmpmeals.com';
    const adminPassword = 'LMP2024Admin!'; // Change this to your desired password
    const adminName = 'Justin Dowd';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log('✅ Admin user already exists:', adminEmail);
        console.log('   Role:', existingAdmin.role);

        // Update to ADMIN role if not already
        if (existingAdmin.role !== 'ADMIN') {
            await prisma.user.update({
                where: { email: adminEmail },
                data: { role: 'ADMIN' }
            });
            console.log('✅ Updated user role to ADMIN');
        }
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            name: adminName,
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: new Date(), // Mark as verified
        }
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('\n📝 Login credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
}

main()
    .catch((e) => {
        console.error('❌ Error creating admin user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
