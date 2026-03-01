
import { PrismaClient, UserRole, ListingType, ListingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123!';

// Simple vehicle brands list (subset of full data)
const CAR_BRANDS = [
  "Toyota", "Nissan", "Honda", "Hyundai", "Kia", 
  "Ford", "Chevrolet", "GMC", "Mercedes-Benz", "BMW", 
  "Lexus", "Mazda", "Mitsubishi", "Land Rover", "Porsche", 
  "MG", "Geely", "Haval", "Changan", "Chery", 
  "Jetour", "BYD", "GAC Motor", "Hongqi", "Tank"
];

const CAR_MODELS: Record<string, string[]> = {
  "Toyota": ["Camry", "Corolla", "Land Cruiser", "Hilux", "RAV4"],
  "Nissan": ["Patrol", "Sunny", "Altima", "Maxima", "X-Trail"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "City"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
  "Kia": ["Cerato", "K5", "Sportage", "Sorento", "Telluride"],
  "BMW": ["X5", "X6", "7 Series", "5 Series", "3 Series"],
  "Mercedes-Benz": ["S-Class", "E-Class", "C-Class", "G-Class", "GLE"],
  "Lexus": ["LX", "ES", "LS", "RX", "GX"],
  // Default for others
  "Other": ["Model X", "Model Y", "GT", "Sport"] 
};

// Returns a random item from array
function rnd<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function createListing(user: any, titleSuffix: string, type: ListingType = ListingType.CAR, agencyId?: string, showroomId?: string) {
  const brand = rnd(CAR_BRANDS);
  const models = CAR_MODELS[brand] || CAR_MODELS["Other"];
  const model = rnd(models);
  
  let title = `${brand} ${model} - ${titleSuffix}`;
  let titleAr = `${brand} ${model} - للبيع`;
  let description = `Test listing for ${titleSuffix}. Great condition.`;
  let descriptionAr = `${brand} ${model} للبيع بحالة ممتازة. للاستفسار والتواصل يرجى الاتصال.`;
  let price = Math.floor(Math.random() * 20000) + 2000;
  
  let specificData = {};

  if (type === ListingType.CAR) {
    specificData = {
      make: brand,
      model: model,
      year: 2020 + Math.floor(Math.random() * 5),
      mileage: Math.floor(Math.random() * 50000),
      bodyType: rnd(['Sedan', 'SUV', 'Coupe']),
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: rnd(['White', 'Black', 'Blue', 'Silver']),
    };
  } if (type === ListingType.BIKE) {
    title = `Harley Davidson Sportster - ${titleSuffix}`;
    titleAr = `هارلي ديفيدسون سبورتستر - للبيع`;
    specificData = {
      make: 'Harley Davidson',
      model: 'Sportster',
      year: 2022,
      bodyType: 'Cruiser',
      mileage: 5000,
      condition: 'Used',
      transmission: 'Manual',
      fuelType: 'Petrol',
    };
  } else if (type === ListingType.PLATE) {
    const plateNum = Math.floor(Math.random() * 999999);
    title = `Unique Plate ${plateNum}`;
    titleAr = `لوحة مميزة ${plateNum}`;
    description = `Special number plate ${plateNum} for sale.`;
    descriptionAr = `لوحة أرقام مميزة ${plateNum} للبيع.`;
    specificData = {
      plateNumber: plateNum.toString(),
      plateCategory: rnd(['Private', 'Commercial', 'Classic']),
       // Minimal required fields to avoid validation errors if schema requires:
       price: price * 0.1, // cheaper
    };
  }

  await prisma.listing.create({
    data: {
      title,
      titleAr,
      description,
      descriptionAr,
      type,
      status: ListingStatus.APPROVED,
      price,
      currency: 'BHD',
      ownerId: user.id,
      agencyId: agencyId,
      showroomId: showroomId,
      city: 'Manama',
      contactPhone: user.phone || '33333333',
      ...specificData,
      media: {
        create: [
          {
            url: type === ListingType.PLATE 
                 ? 'https://dummyimage.com/600x400/000/fff&text=PLATE+123'
                 : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            type: 'image',
            isPrimary: true,
            order: 0
          }
        ]
      }
    }
  });
  process.stdout.write('.'); // Simple progress indicator
}

async function main() {
  console.log('🚀 Starting DEEP seeding...');
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // 1. AGENCIES (5) + EMPLOYEES (5 each) -> All post CARS
  console.log('\n🏢 Processing Agencies...');
  for (let i = 1; i <= 5; i++) {
    const email = `agency_deep_${i}@test.com`;
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email, password: hashedPassword, name: `Agency Manager ${i}`, role: UserRole.AGENCY,
        isApproved: true, isActive: true, phone: `3610000${i}`,
        agency: { create: { name: `Deep Agency ${i}`, city: 'Manama', isApproved: true } }
      },
      update: {},
      include: { agency: true }
    });

    if (user.agency) {
      // Owner posts a car
      await createListing(user, `Owner Post`, ListingType.CAR, user.agency.id);
      
      // 5 Employees
      for (let j = 1; j <= 5; j++) {
        const subEmail = `agency_deep_${i}_emp_${j}@test.com`;
        await prisma.agencySubAdmin.upsert({
          where: { agencyId_email: { agencyId: user.agency.id, email: subEmail } },
          create: { agencyId: user.agency.id, email: subEmail, name: `Emp ${j}`, password: hashedPassword },
          update: {}
        });
        // Employee "posts" a car (Attached to Agency User ID, but noted as Employee Post)
        // Since employees are not Users, we assume the system credits the Agency.
        await createListing(user, `Employee ${j} Post`, ListingType.CAR, user.agency.id);
      }
    }
  }

  // 2. SHOWROOMS (5) + EMPLOYEES (5 each) -> All post CARS
  console.log('\n🏪 Processing Showrooms...');
  for (let i = 1; i <= 5; i++) {
    const email = `showroom_deep_${i}@test.com`;
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email, password: hashedPassword, name: `Showroom Boss ${i}`, role: UserRole.SHOWROOM,
        isApproved: true, isActive: true, phone: `3910000${i}`,
        showroom: { create: { name: `Deep Showroom ${i}`, city: 'Riffa', isApproved: true } }
      },
      update: {},
      include: { showroom: true }
    });

    if (user.showroom) {
      // Owner posts
      await createListing(user, `Owner Post`, ListingType.CAR, undefined, user.showroom.id);
      
      // 5 Employees
      for (let j = 1; j <= 5; j++) {
        const subEmail = `showroom_deep_${i}_emp_${j}@test.com`;
        await prisma.showroomSubAdmin.upsert({
          where: { showroomId_email: { showroomId: user.showroom.id, email: subEmail } },
          create: { showroomId: user.showroom.id, email: subEmail, name: `ShEmp ${j}`, password: hashedPassword },
          update: {}
        });
        await createListing(user, `Employee ${j} Post`, ListingType.CAR, undefined, user.showroom.id);
      }
    }
  }

  // 3. TRADERS (5) -> Each posts a CAR
  console.log('\n👔 Processing Traders...');
  for (let i = 1; i <= 5; i++) {
    const email = `trader_deep_${i}@test.com`;
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email, password: hashedPassword, name: `Trader ${i}`, role: UserRole.TRADER,
        isApproved: true, isActive: true, phone: `3320000${i}`
      },
      update: {}
    });
    await createListing(user, `Trader Stock`, ListingType.CAR);
  }

  // 4. INDIVIDUALS (5) -> Each posts a CAR
  console.log('\n👤 Processing Individuals...');
  for (let i = 1; i <= 5; i++) {
    const email = `indiv_deep_${i}@test.com`;
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email, password: hashedPassword, name: `Individual ${i}`, role: UserRole.INDIVIDUAL,
        isApproved: true, isActive: true, phone: `3340000${i}`
      },
      update: {}
    });
    await createListing(user, `Personal Car`, ListingType.CAR);
  }

  // 5. CUSTOMS CLEARERS (5) -> Each posts a CAR (as requested)
  console.log('\n🛃 Processing Customs Clearers...');
  for (let i = 1; i <= 5; i++) {
    const email = `clearer_deep_${i}@test.com`;
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email, password: hashedPassword, name: `Clearing Agent ${i}`, role: UserRole.TRADER, // Use TRADER role for business
        isApproved: true, isActive: true, phone: `3350000${i}`,
        customsClearers: {
          create: {
            name: `Clearance Office ${i}`,
            phone: `3350000${i}`,
            city: 'Hidd'
          }
        }
      },
      update: {}
    });
    await createListing(user, `Clearance Service Car`, ListingType.CAR);
  }

  // 6. BIKES & PLATES SECTIONS
  console.log('\n🏍️  Adding Bikes & Plates...');
  const randomUser = await prisma.user.findFirst({ where: { role: UserRole.INDIVIDUAL } });
  if (randomUser) {
    for (let k = 0; k < 5; k++) {
      await createListing(randomUser, `Bike Listing ${k+1}`, ListingType.BIKE);
      await createListing(randomUser, `Special Plate ${k+1}`, ListingType.PLATE);
    }
  }

  console.log('\n\n✅ Deep Seeding Complete! Database is ready for stress testing.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
