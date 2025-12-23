import { PrismaClient } from '../src/generated/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Path to the employees data file
const DATA_FILE = path.join(process.cwd(), 'scripts', 'seed-data', 'employees.json');

interface EmployeeData {
    name: string;
    email: string;
    phone?: string;
    position: string;
    department: string;
    status: string;
    salary?: number;
    notes?: string;
}

async function main() {
    console.log('🌱 Seeding employees from JSON data...');
    console.log(`   Reading from: ${DATA_FILE}`);

    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ Error: employees.json not found!');
        process.exit(1);
    }

    const employeesData: EmployeeData[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    console.log(`\n📊 Found ${employeesData.length} employees to seed\n`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const employee of employeesData) {
        try {
            // Check if employee already exists
            const existingEmployee = await prisma.employee.findUnique({
                where: { email: employee.email }
            });

            if (existingEmployee) {
                // Update existing employee if needed
                const needsUpdate =
                    existingEmployee.name !== employee.name ||
                    existingEmployee.phone !== employee.phone ||
                    existingEmployee.position !== employee.position ||
                    existingEmployee.department !== employee.department ||
                    existingEmployee.status !== employee.status ||
                    existingEmployee.salary !== employee.salary ||
                    existingEmployee.notes !== employee.notes;

                if (needsUpdate) {
                    await prisma.employee.update({
                        where: { email: employee.email },
                        data: {
                            name: employee.name,
                            phone: employee.phone,
                            position: employee.position,
                            department: employee.department,
                            status: employee.status,
                            salary: employee.salary,
                            notes: employee.notes,
                        }
                    });
                    console.log(`✏️  Updated: ${employee.name} (${employee.email})`);
                    console.log(`   Position: ${employee.position} - ${employee.department}`);
                    updated++;
                } else {
                    console.log(`⏭️  Skipped: ${employee.name} (${employee.email}) - already exists`);
                    skipped++;
                }
            } else {
                // Create new employee
                const newEmployee = await prisma.employee.create({
                    data: {
                        name: employee.name,
                        email: employee.email,
                        phone: employee.phone,
                        position: employee.position,
                        department: employee.department,
                        status: employee.status,
                        salary: employee.salary,
                        hireDate: new Date(),
                        startDate: new Date(),
                        notes: employee.notes,
                    }
                });

                console.log(`✅ Created: ${newEmployee.name} (${newEmployee.email})`);
                console.log(`   Position: ${newEmployee.position} - ${newEmployee.department}`);
                console.log(`   Status: ${newEmployee.status}`);
                created++;
            }
        } catch (error) {
            console.error(`❌ Error processing ${employee.email}:`, error);
        }
    }

    console.log(`\n🎉 Seeding complete!`);
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ✏️  Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📊 Total: ${employeesData.length}`);

    // Summary by department
    console.log(`\n📋 Employees by Department:`);
    const departments = [...new Set(employeesData.map(e => e.department))];
    for (const dept of departments) {
        const count = employeesData.filter(e => e.department === dept).length;
        console.log(`   ${dept}: ${count}`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding employees:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
