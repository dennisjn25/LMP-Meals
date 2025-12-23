import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔐 Creating admin user...');

    const adminEmail = process.env.ADMIN_EMAIL || 'justin@lmpmeals.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'LMP2024Admin!';
    const adminName = process.env.ADMIN_NAME || 'Justin Dowd';

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
            emailVerified: new Date(),
        }
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
}

main()
    .catch((e) => {
        console.error('❌ Error creating admin user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
