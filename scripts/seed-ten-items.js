"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123!';
const CITIES = [
    "Manama", "Riffa", "Muharraq", "Hamad Town", "Isa Town",
    "Sitra", "Budaiya", "Jidhafs", "Hidd", "Zallaq"
];
const LUXURY_BRANDS = ["Rolls Royce", "Bentley", "Ferrari", "Lamborghini", "Aston Martin", "McLaren", "Bugatti", "Maserati", "Porsche", "Maybach"];
const CLASSIC_BRANDS = ["Ford Mustang", "Chevrolet Camaro", "Mercedes-Benz SL", "Volkswagen Beetle", "Dodge Charger", "Cadillac Eldorado", "Jaguar E-Type", "Pontiac GTO", "Chevrolet Corvette", "Mini Cooper"];
function rnd(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
async function ensurePackageExists(user) {
    const sub = await prisma.subscription.findFirst({
        where: { userId: user.id, status: client_1.SubscriptionStatus.ACTIVE }
    });
    if (!sub) {
        const pkg = await prisma.package.upsert({
            where: { nameEn: 'Unlimited Seed Package' },
            create: {
                nameEn: 'Unlimited Seed Package',
                nameAr: 'باقة غير محدودة',
                price: 0,
                billingType: client_1.PackageBillingType.YEARLY,
                features: { listings: 999, stories: 999, featured: 999 },
                targetAudience: client_1.PackageTarget.ALL
            },
            update: {}
        });
        await prisma.subscription.create({
            data: {
                userId: user.id,
                packageId: pkg.id,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                status: client_1.SubscriptionStatus.ACTIVE,
                limits: pkg.features
            }
        });
    }
}
async function createStory(userId, type = 'IMAGE') {
    await prisma.story.create({
        data: {
            userId,
            mediaUrl: type === 'VIDEO'
                ? 'https://res.cloudinary.com/demo/video/upload/v1/dog.mp4'
                : `https://dummyimage.com/600x1200/${Math.floor(Math.random() * 16777215).toString(16)}/fff&text=Story+${userId.substring(0, 4)}`,
            mediaType: type,
            caption: 'Check out this update! 🚗✨',
            status: client_1.ApprovalStatus.APPROVED,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    });
}
async function createListing(userId, type, overrides = {}, listingTitle = "Listing") {
    const isCar = type === client_1.ListingType.CAR;
    const isBike = type === client_1.ListingType.BIKE;
    const isPlate = type === client_1.ListingType.PLATE;
    let specificData = {};
    if (isCar) {
        specificData = {
            make: overrides.make || rnd(['Toyota', 'Nissan', 'Honda']),
            model: overrides.model || 'Camry',
            year: overrides.year || (2018 + Math.floor(Math.random() * 6)),
            mileage: Math.floor(Math.random() * 100000),
            bodyType: overrides.bodyType || 'Sedan',
            transmission: 'Automatic',
            fuelType: 'Petrol',
            color: rnd(['White', 'Black', 'Silver']),
            price: overrides.price || (5000 + Math.floor(Math.random() * 10000))
        };
    }
    else if (isBike) {
        specificData = {
            make: 'Harley Davidson',
            model: 'Sportster',
            year: 2020,
            bodyType: 'Cruiser',
            mileage: 2000,
            price: 3000 + Math.floor(Math.random() * 5000)
        };
    }
    else if (isPlate) {
        const num = Math.floor(Math.random() * 900000) + 100000;
        specificData = {
            plateNumber: num.toString(),
            plateCategory: 'Private',
            price: 1000 + Math.floor(Math.random() * 20000)
        };
    }
    const finalData = { ...specificData, ...overrides };
    await prisma.listing.create({
        data: {
            title: listingTitle,
            titleAr: `${listingTitle} (AR)`,
            description: 'Test listing description generated by seed script.',
            descriptionAr: 'وصف تجريبي تم إنشاؤه بواسطة السكربت.',
            type,
            status: client_1.ListingStatus.APPROVED,
            price: finalData.price,
            currency: 'BHD',
            ownerId: userId,
            city: 'Manama',
            contactPhone: '33333333',
            isFeatured: overrides.isFeatured || false,
            ...finalData,
            media: {
                create: [
                    {
                        url: isPlate
                            ? `https://dummyimage.com/600x400/000/fff&text=PLATE`
                            : `https://dummyimage.com/600x400/${Math.floor(Math.random() * 16777215).toString(16)}/fff&text=${type}`,
                        type: 'image',
                        isPrimary: true
                    }
                ]
            }
        }
    });
}
async function main() {
    console.log('🚀 Starting 10-Item Seeding...');
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    console.log('🏭 Seeding 10 Showrooms...');
    const showroomUsers = [];
    for (let i = 0; i < 10; i++) {
        const email = `showroom_new_${i}@test.com`;
        const city = CITIES[i % CITIES.length];
        const user = await prisma.user.upsert({
            where: { email },
            create: {
                email, password: hashedPassword, name: `Showroom ${city}`, role: client_1.UserRole.SHOWROOM,
                isApproved: true, isActive: true, phone: `399000${i}`,
                showroom: { create: { name: `Showroom ${city}`, city, isApproved: true } }
            },
            update: {},
            include: { showroom: true }
        });
        await ensurePackageExists(user);
        showroomUsers.push(user);
        await createStory(user.id);
    }
    console.log('👤 Seeding 10 Seller Accounts (5 Individual / 5 Trader)...');
    const sellerUsers = [];
    for (let i = 0; i < 10; i++) {
        const isTrader = i >= 5;
        const role = isTrader ? client_1.UserRole.TRADER : client_1.UserRole.INDIVIDUAL;
        const email = `seller_new_${i}@test.com`;
        const user = await prisma.user.upsert({
            where: { email },
            create: {
                email, password: hashedPassword, name: `${isTrader ? 'Trader' : 'Indiv'} ${i}`, role,
                isApproved: true, isActive: true, phone: `366000${i}`
            },
            update: {}
        });
        await ensurePackageExists(user);
        sellerUsers.push(user);
        await createListing(user.id, client_1.ListingType.CAR, {}, `Seller ${i} Car`);
        await createStory(user.id);
    }
    const allSellers = [...showroomUsers, ...sellerUsers];
    console.log('💎 Seeding 10 Luxury Cars...');
    for (let i = 0; i < 10; i++) {
        const owner = rnd(allSellers);
        const brand = LUXURY_BRANDS[i % LUXURY_BRANDS.length];
        await createListing(owner.id, client_1.ListingType.CAR, {
            make: brand,
            model: 'GT',
            price: 80000 + (i * 5000),
            bodyType: 'Coupe',
            year: 2023,
            isFeatured: true
        }, `${brand} Luxury`);
    }
    console.log('🕰️ Seeding 10 Classic Cars...');
    for (let i = 0; i < 10; i++) {
        const owner = rnd(allSellers);
        const brandModel = CLASSIC_BRANDS[i % CLASSIC_BRANDS.length];
        await createListing(owner.id, client_1.ListingType.CAR, {
            make: 'Classic',
            model: brandModel,
            price: 15000 + (i * 1000),
            year: 1960 + Math.floor(Math.random() * 20),
            bodyType: 'Classic',
            description: 'A beautiful classic car in mint condition.'
        }, `${brandModel} Classic`);
    }
    console.log('🏍️ Seeding 10 Motorcycles...');
    for (let i = 0; i < 10; i++) {
        const owner = rnd(allSellers);
        await createListing(owner.id, client_1.ListingType.BIKE, {}, `Motorcycle ${i + 1}`);
    }
    console.log('🔢 Seeding 10 Plates...');
    for (let i = 0; i < 10; i++) {
        const owner = rnd(allSellers);
        await createListing(owner.id, client_1.ListingType.PLATE, {}, `Plate ${i + 1}`);
    }
    console.log('🛃 Seeding 10 Customs Clearers...');
    for (let i = 0; i < 10; i++) {
        const email = `clearer_new_${i}@test.com`;
        await prisma.user.upsert({
            where: { email },
            create: {
                email, password: hashedPassword, name: `Clearer ${i}`, role: client_1.UserRole.SERVICE_PROVIDER,
                isApproved: true, isActive: true, phone: `331100${i}`,
                serviceProvider: {
                    create: {
                        type: client_1.ServiceProviderType.CUSTOMS_CLEARER,
                        name: `Clearance Service ${i}`,
                        city: CITIES[i % CITIES.length],
                        isApproved: true
                    }
                }
            },
            update: {}
        });
    }
    console.log('🔍 Seeding 10 Inspection Centers...');
    for (let i = 0; i < 10; i++) {
        const email = `inspection_new_${i}@test.com`;
        await prisma.user.upsert({
            where: { email },
            create: {
                email, password: hashedPassword, name: `Inspection ${i}`, role: client_1.UserRole.SERVICE_PROVIDER,
                isApproved: true, isActive: true, phone: `332200${i}`,
                serviceProvider: {
                    create: {
                        type: client_1.ServiceProviderType.INSPECTION_CENTER,
                        name: `CheckPoint ${i}`,
                        city: CITIES[i % CITIES.length],
                        isApproved: true
                    }
                }
            },
            update: {}
        });
    }
    console.log('✨ Seeding 10 Polishing Centers...');
    for (let i = 0; i < 10; i++) {
        const email = `polishing_new_${i}@test.com`;
        await prisma.user.upsert({
            where: { email },
            create: {
                email, password: hashedPassword, name: `Polishing ${i}`, role: client_1.UserRole.SERVICE_PROVIDER,
                isApproved: true, isActive: true, phone: `334400${i}`,
                serviceProvider: {
                    create: {
                        type: client_1.ServiceProviderType.POLISHING_CENTER,
                        name: `Shiny Car ${i}`,
                        city: CITIES[i % CITIES.length],
                        isApproved: true
                    }
                }
            },
            update: {}
        });
    }
    console.log('🚗 Seeding 10 Other Cars...');
    for (let i = 0; i < 10; i++) {
        const owner = rnd(allSellers);
        await createListing(owner.id, client_1.ListingType.CAR, {
            make: 'Other',
            model: 'General Model',
            price: 3000
        }, `Daily Driver ${i + 1}`);
    }
    console.log('✅ 10-Item Seeding Complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-ten-items.js.map