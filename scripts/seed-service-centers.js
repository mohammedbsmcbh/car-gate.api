"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const BAHRAIN_CITIES = [
    'Manama', 'Muharraq', 'Riffa', 'Hamad Town', 'Isa Town',
    'Sitra', 'Budaiya', 'Jidhafs', 'Zallaq', 'Hidd',
];
const BAHRAIN_CITIES_AR = [
    'المنامة', 'المحرق', 'الرفاع', 'مدينة حمد', 'مدينة عيسى',
    'سترة', 'البديع', 'جدحفص', 'الزلاق', 'الحد',
];
function rnd(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function phone() {
    return `+973 3${Math.floor(1000000 + Math.random() * 9000000)}`;
}
const INSPECTION_NAMES = [
    'Gulf Auto Inspection', 'Al Rashid Vehicle Check', 'Bahrain Safety Inspection',
    'Royal Auto Inspection', 'Al Noor Vehicle Testing', 'Star Inspection Center',
    'Premier Auto Check', 'Al Wafa Inspection', 'Golden Gate Inspection',
    'Express Vehicle Inspection', 'Al Salam Auto Test', 'National Inspection Hub',
    'Modern Auto Inspection', 'Al Baraka Vehicle Check', 'Elite Inspection Services',
    'Falcon Auto Inspection', 'Al Manar Vehicle Testing', 'Sunrise Inspection Center',
    'Al Jawhara Auto Check', 'Phoenix Inspection Hub', 'Al Amal Vehicle Test',
    'Blue Shield Inspection', 'Al Aman Auto Inspection', 'Mega Auto Check',
    'Al Maha Inspection Center', 'Green Valley Inspection', 'Al Farida Vehicle Test',
    'Diamond Auto Inspection', 'Al Raha Vehicle Check', 'Crystal Inspection Services',
    'Al Salama Auto Test', 'Horizon Inspection Center', 'Al Zain Vehicle Inspection',
    'Nova Auto Check', 'Al Hana Inspection Hub', 'Oasis Vehicle Testing',
    'Al Nada Inspection Center', 'Crown Auto Inspection', 'Al Watan Vehicle Check',
    'Pacific Inspection Services', 'Al Hawra Auto Test', 'Unity Inspection Center',
    'Al Safa Vehicle Inspection', 'Prestige Auto Check', 'Al Bayan Inspection Hub',
    'Liberty Vehicle Testing', 'Al Reem Inspection Center', 'Summit Auto Check',
    'Al Khaleej Vehicle Test', 'Zenith Inspection Services',
];
const INSPECTION_NAMES_AR = [
    'مركز فحص الخليج للسيارات', 'مركز الراشد لفحص المركبات', 'مركز البحرين للفحص الأمني',
    'مركز الملكي لفحص السيارات', 'مركز النور لاختبار المركبات', 'مركز ستار لفحص السيارات',
    'مركز الفحص المتميز', 'مركز الوفاء للفحص', 'مركز البوابة الذهبية',
    'مركز الفحص السريع', 'مركز السلام لاختبار السيارات', 'المركز الوطني للفحص',
    'مركز الفحص الحديث', 'مركز البركة لفحص المركبات', 'خدمات الفحص المتطورة',
    'مركز فحص الصقر', 'مركز المنار لاختبار المركبات', 'مركز شروق للفحص',
    'مركز الجوهرة لفحص السيارات', 'مركز فينيكس للفحص', 'مركز الأمل لاختبار المركبات',
    'مركز دروع الزرقاء للفحص', 'مركز الأمان لفحص السيارات', 'مركز ميجا للفحص',
    'مركز الماحة للفحص', 'مركز الوادي الأخضر للفحص', 'مركز الفريدة لاختبار المركبات',
    'مركز الماس لفحص السيارات', 'مركز الراحة لفحص المركبات', 'خدمات كريستال للفحص',
    'مركز السلامة لاختبار السيارات', 'مركز الأفق للفحص', 'مركز الزين لفحص المركبات',
    'مركز نوفا للفحص', 'مركز الهناء للفحص', 'مركز الواحة لاختبار المركبات',
    'مركز الندى للفحص', 'مركز كراون لفحص السيارات', 'مركز الوطن لفحص المركبات',
    'خدمات باسيفيك للفحص', 'مركز الحوراء لاختبار السيارات', 'مركز الوحدة للفحص',
    'مركز الصفا لفحص المركبات', 'مركز بريستيج للفحص', 'مركز البيان للفحص',
    'مركز ليبرتي لاختبار المركبات', 'مركز الريم للفحص', 'مركز سميت للفحص',
    'مركز الخليج لاختبار المركبات', 'خدمات زينيث للفحص',
];
const POLISHING_NAMES = [
    'Shine Auto Detailing', 'Al Lulu Car Polish', 'Gulf Detailing Pro',
    'Bahrain Elite Polish', 'Al Noor Auto Spa', 'Crystal Clear Detailing',
    'Royal Shine Center', 'Al Jawhara Car Care', 'Premier Auto Detailing',
    'Al Baraka Polish Hub', 'Diamond Shine Studio', 'Al Rashid Car Spa',
    'Luxury Auto Detailing', 'Al Salam Polish Center', 'Golden Touch Detailing',
    'Falcon Car Spa', 'Al Maha Shine Center', 'Prestige Auto Polish',
    'Al Wafa Car Care', 'Mirror Shine Detailing', 'Al Raha Auto Spa',
    'Star Detailing Studio', 'Al Amal Car Polish', 'Summit Auto Detailing',
    'Al Salama Shine Hub', 'Nova Car Care Center', 'Al Hana Polish Studio',
    'Elite Detailing Services', 'Al Farida Auto Spa', 'Crown Polish Center',
    'Al Manar Car Detailing', 'Oasis Auto Polish', 'Al Zain Shine Center',
    'Horizon Detailing Hub', 'Al Nada Car Care', 'Liberty Auto Detailing',
    'Al Aman Polish Center', 'Pacific Car Spa', 'Al Reem Detailing Studio',
    'Blue Shine Auto Care', 'Al Bayan Car Polish', 'Unity Detailing Center',
    'Al Safa Auto Spa', 'Phoenix Car Care', 'Al Khaleej Shine Hub',
    'Zenith Detailing Studio', 'Al Watan Car Polish', 'Mega Shine Center',
    'Al Hawra Auto Detailing', 'Dream Shine Detailing',
];
const POLISHING_NAMES_AR = [
    'مركز شاين لتلميع السيارات', 'مركز اللؤلؤ للتلميع', 'الخليج برو للتفصيل',
    'مركز البحرين للتلميع المتميز', 'مركز النور لعناية السيارات', 'مركز كريستال للتلميع',
    'مركز رويال شاين', 'مركز الجوهرة لعناية السيارات', 'مركز التفصيل المتميز',
    'مركز البركة للتلميع', 'استوديو دايموند شاين', 'مركز الراشد لعناية السيارات',
    'مركز التفصيل الفاخر', 'مركز السلام للتلميع', 'مركز جولدن تاتش للتفصيل',
    'مركز فالكون لعناية السيارات', 'مركز الماحة للتلميع', 'مركز بريستيج للتلميع',
    'مركز الوفاء لعناية السيارات', 'مركز ميرور شاين للتفصيل', 'مركز الراحة لعناية السيارات',
    'استوديو ستار للتفصيل', 'مركز الأمل للتلميع', 'مركز سميت للتفصيل',
    'مركز السلامة للتلميع', 'مركز نوفا لعناية السيارات', 'استوديو الهناء للتلميع',
    'خدمات إيليت للتفصيل', 'مركز الفريدة لعناية السيارات', 'مركز كراون للتلميع',
    'مركز المنار لتفصيل السيارات', 'مركز الواحة للتلميع', 'مركز الزين للتلميع',
    'مركز الأفق للتفصيل', 'مركز الندى لعناية السيارات', 'مركز ليبرتي للتفصيل',
    'مركز الأمان للتلميع', 'مركز باسيفيك لعناية السيارات', 'استوديو الريم للتفصيل',
    'مركز بلو شاين لعناية السيارات', 'مركز البيان للتلميع', 'مركز الوحدة للتفصيل',
    'مركز الصفا لعناية السيارات', 'مركز فينيكس لعناية السيارات', 'مركز الخليج للتلميع',
    'استوديو زينيث للتفصيل', 'مركز الوطن للتلميع', 'مركز ميجا شاين',
    'مركز الحوراء للتفصيل', 'مركز دريم شاين للتلميع',
];
const CLEARER_NAMES = [
    'Al Rashid Customs Clearance', 'Gulf Trade Solutions', 'Bahrain Import Services',
    'Al Noor Clearance Office', 'Royal Customs Agency', 'Al Baraka Trade Hub',
    'Premier Clearance Services', 'Al Wafa Customs Expert', 'Golden Gate Clearance',
    'Star Customs Solutions', 'Al Salam Import Office', 'Express Clearance Hub',
    'Al Jawhara Trade Agency', 'Modern Customs Services', 'Al Maha Import Expert',
    'Falcon Customs Clearance', 'Al Manar Trade Solutions', 'Elite Import Services',
    'Al Hana Customs Agency', 'Horizon Trade Hub', 'Al Amal Clearance Office',
    'Diamond Customs Solutions', 'Al Raha Import Agency', 'Nova Clearance Services',
    'Al Salama Trade Expert', 'Pacific Customs Hub', 'Al Farida Import Solutions',
    'Crown Clearance Agency', 'Al Zain Customs Office', 'Liberty Trade Services',
    'Al Nada Clearance Agency', 'Summit Customs Solutions', 'Al Watan Import Hub',
    'Unity Clearance Services', 'Al Safa Trade Agency', 'Blue Shield Customs',
    'Al Aman Import Solutions', 'Prestige Clearance Hub', 'Al Reem Customs Office',
    'Oasis Trade Services', 'Al Bayan Clearance Agency', 'Phoenix Import Hub',
    'Al Khaleej Customs Solutions', 'Zenith Trade Agency', 'Al Hawra Clearance',
    'National Import Services', 'Al Wafa Trade Expert', 'Mega Customs Hub',
    'Al Lulu Clearance Agency', 'Crystal Trade Solutions',
];
const CLEARER_NAMES_AR = [
    'مكتب الراشد للتخليص الجمركي', 'حلول الخليج التجارية', 'خدمات الاستيراد البحرينية',
    'مكتب النور للتخليص', 'وكالة الملكية للجمارك', 'مركز البركة التجاري',
    'خدمات التخليص المتميزة', 'خبير الوفاء الجمركي', 'مكتب البوابة الذهبية',
    'حلول ستار الجمركية', 'مكتب السلام للاستيراد', 'مركز التخليص السريع',
    'وكالة الجوهرة التجارية', 'خدمات الجمارك الحديثة', 'خبير الماحة للاستيراد',
    'مكتب الصقر للتخليص الجمركي', 'حلول المنار التجارية', 'خدمات الاستيراد المتطورة',
    'وكالة الهناء الجمركية', 'مركز أفق للتجارة', 'مكتب الأمل للتخليص',
    'حلول الماس الجمركية', 'وكالة الراحة للاستيراد', 'خدمات نوفا للتخليص',
    'خبير السلامة التجاري', 'مركز باسيفيك الجمركي', 'حلول الفريدة للاستيراد',
    'وكالة كراون للتخليص', 'مكتب الزين الجمركي', 'خدمات ليبرتي التجارية',
    'وكالة الندى للتخليص', 'حلول سميت الجمركية', 'مركز الوطن للاستيراد',
    'خدمات الوحدة للتخليص', 'وكالة الصفا التجارية', 'مكتب بلو شيلد الجمركي',
    'حلول الأمان للاستيراد', 'مركز بريستيج للتخليص', 'مكتب الريم الجمركي',
    'خدمات الواحة التجارية', 'وكالة البيان للتخليص', 'مركز فينيكس للاستيراد',
    'حلول الخليج الجمركية', 'وكالة زينيث التجارية', 'مكتب الحوراء للتخليص',
    'خدمات الاستيراد الوطنية', 'خبير الوفاء التجاري', 'مركز ميجا الجمركي',
    'وكالة اللؤلؤ للتخليص', 'حلول كريستال التجارية',
];
async function seedInspectionCenters() {
    console.log('🔍 Seeding 50 Inspection Centers...');
    for (let i = 0; i < 50; i++) {
        const cityIndex = i % BAHRAIN_CITIES.length;
        await prisma.inspectionCenter.create({
            data: {
                name: INSPECTION_NAMES[i],
                nameAr: INSPECTION_NAMES_AR[i],
                description: `Professional vehicle inspection services including safety checks, emissions testing, and comprehensive mechanical inspection. Serving ${BAHRAIN_CITIES[cityIndex]} and surrounding areas.`,
                city: BAHRAIN_CITIES[cityIndex],
                address: `Block ${Math.floor(Math.random() * 900) + 100}, Road ${Math.floor(Math.random() * 3000) + 100}, ${BAHRAIN_CITIES[cityIndex]}`,
                phone: phone(),
                isActive: true,
            },
        });
    }
    console.log('✅ 50 Inspection Centers created');
}
async function seedPolishingCenters() {
    console.log('✨ Seeding 50 Polishing Centers...');
    for (let i = 0; i < 50; i++) {
        const cityIndex = i % BAHRAIN_CITIES.length;
        await prisma.polishingCenter.create({
            data: {
                name: POLISHING_NAMES[i],
                nameAr: POLISHING_NAMES_AR[i],
                description: `Expert car detailing and polishing services including full exterior polish, ceramic coating, interior deep cleaning, and paint protection film. Serving ${BAHRAIN_CITIES[cityIndex]}.`,
                city: BAHRAIN_CITIES[cityIndex],
                address: `Block ${Math.floor(Math.random() * 900) + 100}, Road ${Math.floor(Math.random() * 3000) + 100}, ${BAHRAIN_CITIES[cityIndex]}`,
                phone: phone(),
                isActive: true,
            },
        });
    }
    console.log('✅ 50 Polishing Centers created');
}
async function seedCustomsClearers() {
    console.log('📦 Seeding 50 Customs Clearers...');
    let systemUser = await prisma.user.findFirst({ where: { email: 'system@cargate.bh' } });
    if (!systemUser) {
        const bcrypt = await import('bcrypt');
        systemUser = await prisma.user.create({
            data: {
                email: 'system@cargate.bh',
                name: 'System',
                password: await bcrypt.hash('System@123!', 10),
                role: 'SUPER_ADMIN',
                isApproved: true,
                isActive: true,
            },
        });
    }
    for (let i = 0; i < 50; i++) {
        const cityIndex = i % BAHRAIN_CITIES.length;
        await prisma.customsClearer.create({
            data: {
                name: CLEARER_NAMES[i],
                description: `${CLEARER_NAMES_AR[i]} - خدمات التخليص الجمركي الشاملة لاستيراد وتسجيل المركبات في ${BAHRAIN_CITIES_AR[cityIndex]}. نقدم خدمات سريعة وموثوقة.`,
                phone: phone(),
                whatsapp: phone(),
                email: `info@${CLEARER_NAMES[i].toLowerCase().replace(/\s+/g, '')}.bh`,
                city: BAHRAIN_CITIES[cityIndex],
                address: `Block ${Math.floor(Math.random() * 900) + 100}, Road ${Math.floor(Math.random() * 3000) + 100}, ${BAHRAIN_CITIES[cityIndex]}`,
                isActive: true,
                createdById: systemUser.id,
            },
        });
    }
    console.log('✅ 50 Customs Clearers created');
}
async function main() {
    console.log('🚀 Starting service centers seed...\n');
    try {
        await seedInspectionCenters();
        await seedPolishingCenters();
        await seedCustomsClearers();
        console.log('\n🎉 All 150 records created successfully!');
        console.log('   ✅ 50 Inspection Centers');
        console.log('   ✅ 50 Polishing Centers');
        console.log('   ✅ 50 Customs Clearers');
    }
    catch (err) {
        console.error('❌ Seed failed:', err);
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed-service-centers.js.map