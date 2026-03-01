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
function phone() {
    return `+973 3${Math.floor(1000000 + Math.random() * 8999999)}`;
}
const INSPECTION_CENTERS = [
    {
        name: 'Gulf Auto Inspection',
        nameAr: 'مركز الخليج لفحص السيارات',
        description: 'Professional vehicle inspection covering safety, emissions, and full mechanical checks.',
        city: 'Manama',
        phone: '+973 33112233',
        whatsapp: '+973 33112233',
        services: [
            { nameEn: 'Standard Safety Inspection', nameAr: 'فحص السلامة الأساسي', price: 12, duration: '45 min' },
            { nameEn: 'Comprehensive Vehicle Check', nameAr: 'فحص شامل للمركبة', price: 25, duration: '90 min' },
            { nameEn: 'Pre-Purchase Inspection', nameAr: 'فحص قبل الشراء', price: 35, duration: '2 hours' },
            { nameEn: 'Emissions Test', nameAr: 'اختبار الانبعاثات', price: 8, duration: '20 min' },
        ],
    },
    {
        name: 'Al Rashid Vehicle Testing',
        nameAr: 'مركز الراشد لاختبار المركبات',
        description: 'Trusted inspection center with over 15 years of experience in Bahrain.',
        city: 'Muharraq',
        phone: '+973 36778899',
        whatsapp: '+973 36778899',
        services: [
            { nameEn: 'Annual Vehicle Inspection', nameAr: 'الفحص السنوي للمركبة', price: 15, duration: '1 hour' },
            { nameEn: 'Engine Diagnostic', nameAr: 'تشخيص المحرك', price: 20, duration: '45 min' },
            { nameEn: 'Brake & Suspension Check', nameAr: 'فحص الفرامل والتعليق', price: 18, duration: '1 hour' },
        ],
    },
    {
        name: 'Royal Auto Inspection',
        nameAr: 'مركز رويال لفحص السيارات',
        description: 'State-of-the-art inspection equipment with certified technicians.',
        city: 'Riffa',
        phone: '+973 37445566',
        whatsapp: '+973 37445566',
        services: [
            { nameEn: 'Full Vehicle Inspection', nameAr: 'فحص كامل للسيارة', price: 30, duration: '2 hours' },
            { nameEn: 'Used Car Report', nameAr: 'تقرير السيارة المستعملة', price: 45, duration: '2.5 hours' },
            { nameEn: 'Quick Safety Check', nameAr: 'فحص سلامة سريع', price: 10, duration: '30 min' },
        ],
    },
    {
        name: 'Bahrain Safety Inspection',
        nameAr: 'مركز البحرين للفحص الأمني',
        description: 'Official certified inspection services for all vehicle types.',
        city: 'Hamad Town',
        phone: '+973 38990011',
        whatsapp: '+973 38990011',
        services: [
            { nameEn: 'Standard Inspection', nameAr: 'الفحص الأساسي', price: 12, duration: '45 min' },
            { nameEn: 'Luxury Vehicle Inspection', nameAr: 'فحص السيارات الفاخرة', price: 50, duration: '3 hours' },
            { nameEn: 'Motorcycle Inspection', nameAr: 'فحص الدراجات النارية', price: 8, duration: '30 min' },
        ],
    },
    {
        name: 'Express Vehicle Inspection',
        nameAr: 'مركز الفحص السريع للمركبات',
        description: 'Fast and reliable inspections — no appointment needed.',
        city: 'Isa Town',
        phone: '+973 32334455',
        whatsapp: '+973 32334455',
        services: [
            { nameEn: 'Express Inspection', nameAr: 'الفحص السريع', price: 15, duration: '30 min' },
            { nameEn: 'Mechanical Inspection', nameAr: 'الفحص الميكانيكي', price: 22, duration: '1 hour' },
            { nameEn: 'Oil & Fluids Check', nameAr: 'فحص الزيت والسوائل', price: 5, duration: '15 min' },
        ],
    },
];
const POLISHING_CENTERS = [
    {
        name: 'Shine Auto Detailing',
        nameAr: 'مركز شاين لتلميع السيارات',
        description: 'Premium car detailing with nano-ceramic coatings and paint protection films.',
        city: 'Manama',
        phone: '+973 33556677',
        whatsapp: '+973 33556677',
        services: [
            { nameEn: 'Basic Exterior Polish', nameAr: 'تلميع خارجي أساسي', price: 25, duration: '2 hours' },
            { nameEn: 'Full Body Detailing', nameAr: 'تفصيل كامل', price: 80, duration: '5 hours' },
            { nameEn: 'Ceramic Coating', nameAr: 'طلاء سيراميك', price: 250, duration: '2 days' },
            { nameEn: 'Interior Deep Clean', nameAr: 'تنظيف داخلي عميق', price: 45, duration: '3 hours' },
        ],
    },
    {
        name: 'Diamond Shine Studio',
        nameAr: 'استوديو دايموند للتلميع',
        description: 'Luxury car care specialists with German-imported polishing products.',
        city: 'Jidhafs',
        phone: '+973 36112233',
        whatsapp: '+973 36112233',
        services: [
            { nameEn: 'Paint Correction', nameAr: 'تصحيح الطلاء', price: 150, duration: '8 hours' },
            { nameEn: 'PPF Installation', nameAr: 'تركيب طبقة حماية الطلاء', price: 400, duration: '3 days' },
            { nameEn: 'Headlight Restoration', nameAr: 'ترميم المصابيح', price: 35, duration: '1 hour' },
        ],
    },
    {
        name: 'Royal Shine Center',
        nameAr: 'مركز رويال شاين',
        description: 'Complete car spa experience with premium products only.',
        city: 'Riffa',
        phone: '+973 37889900',
        whatsapp: '+973 37889900',
        services: [
            { nameEn: 'Gold Package Detailing', nameAr: 'باقة الذهب للتفصيل', price: 120, duration: '6 hours' },
            { nameEn: 'Engine Bay Cleaning', nameAr: 'تنظيف حجرة المحرك', price: 40, duration: '1.5 hours' },
            { nameEn: 'Leather Conditioning', nameAr: 'معالجة الجلد', price: 55, duration: '2 hours' },
            { nameEn: 'Quick Wash & Polish', nameAr: 'غسيل وتلميع سريع', price: 20, duration: '1 hour' },
        ],
    },
    {
        name: 'Crystal Clear Detailing',
        nameAr: 'مركز كريستال للتلميع',
        description: 'Affordable professional detailing for all car models.',
        city: 'Sitra',
        phone: '+973 38445566',
        whatsapp: '+973 38445566',
        services: [
            { nameEn: 'Standard Wash & Wax', nameAr: 'غسيل وشمع', price: 15, duration: '1.5 hours' },
            { nameEn: 'Foam Wash + Interior', nameAr: 'غسيل رغوة + داخلي', price: 30, duration: '2 hours' },
            { nameEn: 'Car Perfume & Finishing', nameAr: 'عطر السيارة والتشطيب', price: 10, duration: '30 min' },
        ],
    },
    {
        name: 'Prestige Auto Polish',
        nameAr: 'مركز بريستيج للتلميع',
        description: 'VIP mobile detailing service — we come to your location.',
        city: 'Budaiya',
        phone: '+973 31223344',
        whatsapp: '+973 31223344',
        services: [
            { nameEn: 'Mobile Detailing (Basic)', nameAr: 'تفصيل متنقل (أساسي)', price: 60, duration: '3 hours' },
            { nameEn: 'Mobile Full Detailing', nameAr: 'تفصيل متنقل كامل', price: 120, duration: '5 hours' },
            { nameEn: 'Odor Elimination', nameAr: 'إزالة الروائح', price: 40, duration: '2 hours' },
        ],
    },
];
const CUSTOMS_CLEARERS = [
    {
        name: 'Al Rashid Customs Clearance',
        nameAr: 'مكتب الراشد للتخليص الجمركي',
        description: 'Over 20 years of expertise in vehicle import and customs clearance in Bahrain.',
        city: 'Manama',
        phone: '+973 33998877',
        whatsapp: '+973 33998877',
        services: [
            { nameEn: 'New Car Import Clearance', nameAr: 'تخليص استيراد سيارة جديدة', price: 150, duration: '3-5 days' },
            { nameEn: 'Used Car Clearance', nameAr: 'تخليص سيارة مستعملة', price: 120, duration: '5-7 days' },
            { nameEn: 'Ownership Transfer', nameAr: 'نقل الملكية', price: 80, duration: '1-2 days' },
            { nameEn: 'Re-Export Services', nameAr: 'خدمات إعادة التصدير', price: 200, duration: '7-10 days' },
        ],
    },
    {
        name: 'Gulf Trade Solutions',
        nameAr: 'حلول الخليج التجارية',
        description: 'Fast and reliable customs clearance with a dedicated team for each client.',
        city: 'Muharraq',
        phone: '+973 36554433',
        whatsapp: '+973 36554433',
        services: [
            { nameEn: 'Express Car Clearance', nameAr: 'تخليص سريع للسيارة', price: 250, duration: '1-2 days' },
            { nameEn: 'Plate Registration', nameAr: 'تسجيل اللوحة', price: 50, duration: '1 day' },
            { nameEn: 'License Renewal', nameAr: 'تجديد الرخصة', price: 30, duration: 'Same day' },
        ],
    },
    {
        name: 'Premier Clearance Services',
        nameAr: 'خدمات التخليص المتميزة',
        description: 'Specializing in luxury and sports car imports with white-glove service.',
        city: 'Manama',
        phone: '+973 37223344',
        whatsapp: '+973 37223344',
        services: [
            { nameEn: 'Luxury Car Import', nameAr: 'استيراد سيارة فاخرة', price: 350, duration: '5-7 days' },
            { nameEn: 'Full Clearance Package', nameAr: 'باقة التخليص الكاملة', price: 500, duration: '7-10 days' },
            { nameEn: 'Document Processing Only', nameAr: 'معالجة الوثائق فقط', price: 60, duration: '1-2 days' },
        ],
    },
    {
        name: 'Bahrain Import Services',
        nameAr: 'خدمات الاستيراد البحرينية',
        description: 'Transparent pricing and real-time status updates for all clearance requests.',
        city: 'Riffa',
        phone: '+973 38667788',
        whatsapp: '+973 38667788',
        services: [
            { nameEn: 'Standard Car Clearance', nameAr: 'تخليص سيارة عادي', price: 100, duration: '3-5 days' },
            { nameEn: 'Motorcycle Clearance', nameAr: 'تخليص دراجة نارية', price: 70, duration: '3 days' },
            { nameEn: 'Vehicle Re-Registration', nameAr: 'إعادة تسجيل المركبة', price: 45, duration: '1 day' },
        ],
    },
    {
        name: 'Royal Customs Agency',
        nameAr: 'وكالة الملكية للجمارك',
        description: 'Your trusted partner for all official vehicle documents and customs in Bahrain.',
        city: 'Hamad Town',
        phone: '+973 31447788',
        whatsapp: '+973 31447788',
        services: [
            { nameEn: 'GCC Car Import', nameAr: 'استيراد سيارة خليجية', price: 90, duration: '2-4 days' },
            { nameEn: 'Non-GCC Car Import', nameAr: 'استيراد سيارة غير خليجية', price: 220, duration: '7-14 days' },
            { nameEn: 'Customs Exemption', nameAr: 'الإعفاء الجمركي', price: 150, duration: '5-7 days' },
        ],
    },
];
const SAMPLE_CUSTOMERS = [
    { name: 'Ahmed Al Khalid', email: 'ahmed.test@cargate.bh', phone: '+973 33111222' },
    { name: 'Sara Al Mansoori', email: 'sara.test@cargate.bh', phone: '+973 36222333' },
    { name: 'Mohammed Hassan', email: 'mohammed.test@cargate.bh', phone: '+973 38333444' },
];
const SAMPLE_BOOKINGS = [
    { customerName: 'Ahmed Al Khalid', customerPhone: '+973 33111222', date: '2026-03-05', time: '10:00 AM', status: client_1.BookingStatus.PENDING },
    { customerName: 'Sara Al Mansoori', customerPhone: '+973 36222333', date: '2026-03-08', time: '02:30 PM', status: client_1.BookingStatus.CONFIRMED, notes: 'Please check the AC as well' },
    { customerName: 'Mohammed Hassan', customerPhone: '+973 38333444', date: '2026-02-20', time: '11:00 AM', status: client_1.BookingStatus.COMPLETED },
    { customerName: 'Fatima Al Zaabi', customerPhone: '+973 33445566', date: '2026-03-10', status: client_1.BookingStatus.PENDING },
];
const SAMPLE_REQUESTS = [
    { customerName: 'Ahmed Al Khalid', customerPhone: '+973 33111222', requestType: 'new_car_clearance', status: client_1.ServiceRequestStatus.PENDING, notes: '2024 Toyota Land Cruiser from Japan' },
    { customerName: 'Sara Al Mansoori', customerPhone: '+973 36222333', requestType: 'ownership_transfer', status: client_1.ServiceRequestStatus.IN_PROGRESS, notes: 'Transfer from father to son' },
    { customerName: 'Khalid Al Dosari', customerPhone: '+973 37556677', requestType: 'plate_registration', status: client_1.ServiceRequestStatus.COMPLETED },
    { customerName: 'Noura Al Sayed', customerPhone: '+973 39887766', requestType: 'used_car_clearance', status: client_1.ServiceRequestStatus.PENDING, notes: 'BMW 5 Series 2022 from USA' },
];
async function main() {
    console.log('🚀 Seeding Service Providers (new system)...\n');
    const passwordHash = await bcrypt.hash('Provider@123!', 10);
    let dummyCustomer = await prisma.user.findFirst({ where: { email: 'customer.demo@cargate.bh' } });
    if (!dummyCustomer) {
        dummyCustomer = await prisma.user.create({
            data: {
                email: 'customer.demo@cargate.bh',
                name: 'Demo Customer',
                password: await bcrypt.hash('Customer@123!', 10),
                role: 'INDIVIDUAL',
                isApproved: true,
                isActive: true,
            },
        });
        console.log('👤 Created demo customer user');
    }
    console.log('🔍 Seeding Inspection Centers...');
    for (let i = 0; i < INSPECTION_CENTERS.length; i++) {
        const c = INSPECTION_CENTERS[i];
        const email = `inspection${i + 1}@cargate.bh`;
        let user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: c.name,
                    password: passwordHash,
                    role: 'SERVICE_PROVIDER',
                    isApproved: true,
                    isActive: true,
                },
            });
        }
        let provider = await prisma.serviceProvider.findFirst({ where: { userId: user.id } });
        if (!provider) {
            provider = await prisma.serviceProvider.create({
                data: {
                    userId: user.id,
                    type: 'INSPECTION_CENTER',
                    name: c.name,
                    nameAr: c.nameAr,
                    description: c.description,
                    city: c.city,
                    phone: c.phone,
                    whatsapp: c.whatsapp,
                    isApproved: true,
                },
            });
        }
        for (const svc of c.services) {
            const existing = await prisma.serviceItem.findFirst({
                where: { serviceProviderId: provider.id, nameEn: svc.nameEn },
            });
            if (!existing) {
                const item = await prisma.serviceItem.create({
                    data: {
                        serviceProviderId: provider.id,
                        nameEn: svc.nameEn,
                        nameAr: svc.nameAr,
                        price: svc.price,
                        duration: svc.duration,
                        isActive: true,
                        status: client_1.ApprovalStatus.APPROVED,
                    },
                });
                if (i === 0 && c.services.indexOf(svc) < SAMPLE_BOOKINGS.length) {
                    const b = SAMPLE_BOOKINGS[c.services.indexOf(svc)];
                    await prisma.booking.create({
                        data: {
                            serviceItemId: item.id,
                            customerId: dummyCustomer.id,
                            customerName: b.customerName,
                            customerPhone: b.customerPhone,
                            date: b.date,
                            time: b.time,
                            notes: b.notes,
                            status: b.status,
                        },
                    });
                }
            }
        }
        console.log(`   ✅ ${c.name}`);
    }
    console.log('\n✨ Seeding Polishing Centers...');
    for (let i = 0; i < POLISHING_CENTERS.length; i++) {
        const c = POLISHING_CENTERS[i];
        const email = `polishing${i + 1}@cargate.bh`;
        let user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: c.name,
                    password: passwordHash,
                    role: 'SERVICE_PROVIDER',
                    isApproved: true,
                    isActive: true,
                },
            });
        }
        let provider = await prisma.serviceProvider.findFirst({ where: { userId: user.id } });
        if (!provider) {
            provider = await prisma.serviceProvider.create({
                data: {
                    userId: user.id,
                    type: 'POLISHING_CENTER',
                    name: c.name,
                    nameAr: c.nameAr,
                    description: c.description,
                    city: c.city,
                    phone: c.phone,
                    whatsapp: c.whatsapp,
                    isApproved: true,
                },
            });
        }
        for (const svc of c.services) {
            const existing = await prisma.serviceItem.findFirst({
                where: { serviceProviderId: provider.id, nameEn: svc.nameEn },
            });
            if (!existing) {
                const item = await prisma.serviceItem.create({
                    data: {
                        serviceProviderId: provider.id,
                        nameEn: svc.nameEn,
                        nameAr: svc.nameAr,
                        price: svc.price,
                        duration: svc.duration,
                        isActive: true,
                        status: client_1.ApprovalStatus.APPROVED,
                    },
                });
                if (i === 0 && c.services.indexOf(svc) < 2) {
                    const b = SAMPLE_BOOKINGS[c.services.indexOf(svc)];
                    await prisma.booking.create({
                        data: {
                            serviceItemId: item.id,
                            customerId: dummyCustomer.id,
                            customerName: b.customerName,
                            customerPhone: b.customerPhone,
                            date: b.date,
                            time: b.time,
                            notes: b.notes,
                            status: b.status,
                        },
                    });
                }
            }
        }
        console.log(`   ✅ ${c.name}`);
    }
    console.log('\n📦 Seeding Customs Clearers...');
    for (let i = 0; i < CUSTOMS_CLEARERS.length; i++) {
        const c = CUSTOMS_CLEARERS[i];
        const email = `customs${i + 1}@cargate.bh`;
        let user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: c.name,
                    password: passwordHash,
                    role: 'SERVICE_PROVIDER',
                    isApproved: true,
                    isActive: true,
                },
            });
        }
        let provider = await prisma.serviceProvider.findFirst({ where: { userId: user.id } });
        if (!provider) {
            provider = await prisma.serviceProvider.create({
                data: {
                    userId: user.id,
                    type: 'CUSTOMS_CLEARER',
                    name: c.name,
                    nameAr: c.nameAr,
                    description: c.description,
                    city: c.city,
                    phone: c.phone,
                    whatsapp: c.whatsapp,
                    isApproved: true,
                },
            });
        }
        for (const svc of c.services) {
            const existing = await prisma.serviceItem.findFirst({
                where: { serviceProviderId: provider.id, nameEn: svc.nameEn },
            });
            if (!existing) {
                await prisma.serviceItem.create({
                    data: {
                        serviceProviderId: provider.id,
                        nameEn: svc.nameEn,
                        nameAr: svc.nameAr,
                        price: svc.price,
                        duration: svc.duration,
                        isActive: true,
                        status: client_1.ApprovalStatus.APPROVED,
                    },
                });
            }
        }
        if (i === 0) {
            const existingReqs = await prisma.serviceRequest.findMany({ where: { serviceProviderId: provider.id } });
            if (existingReqs.length === 0) {
                for (const req of SAMPLE_REQUESTS) {
                    await prisma.serviceRequest.create({
                        data: {
                            serviceProviderId: provider.id,
                            customerId: dummyCustomer.id,
                            customerName: req.customerName,
                            customerPhone: req.customerPhone,
                            requestType: req.requestType,
                            notes: req.notes,
                            status: req.status,
                        },
                    });
                }
            }
        }
        console.log(`   ✅ ${c.name}`);
    }
    const totals = {
        providers: await prisma.serviceProvider.count(),
        services: await prisma.serviceItem.count(),
        bookings: await prisma.booking.count(),
        requests: await prisma.serviceRequest.count(),
    };
    console.log('\n🎉 Seed complete!');
    console.log(`   🔍 Inspection Centers : ${INSPECTION_CENTERS.length}`);
    console.log(`   ✨ Polishing Centers  : ${POLISHING_CENTERS.length}`);
    console.log(`   📦 Customs Clearers  : ${CUSTOMS_CLEARERS.length}`);
    console.log(`   🔧 Total Services    : ${totals.services}`);
    console.log(`   📅 Sample Bookings   : ${totals.bookings}`);
    console.log(`   📋 Sample Requests   : ${totals.requests}`);
    console.log('\n🔑 Login credentials (all providers):');
    console.log('   inspection1@cargate.bh  → inspection5@cargate.bh');
    console.log('   polishing1@cargate.bh   → polishing5@cargate.bh');
    console.log('   customs1@cargate.bh     → customs5@cargate.bh');
    console.log('   Password: Provider@123!');
}
main()
    .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-service-providers.js.map