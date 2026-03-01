"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ARAB_BODY_TYPES = {
    'Sedan': 'سيدان', 'SUV': 'دفع رباعي', 'Coupe': 'كوبيه',
    'Truck': 'شاحنة', 'Van': 'فان', 'Hatchback': 'هاتشباك',
    'Convertible': 'كشف', 'Pickup': 'بيك آب', 'Wagon': 'عربة',
    'Cruiser': 'كروزر',
};
const ARAB_COLORS = {
    'White': 'أبيض', 'Black': 'أسود', 'Silver': 'فضي', 'Gray': 'رمادي',
    'Red': 'أحمر', 'Blue': 'أزرق', 'Green': 'أخضر', 'Brown': 'بني',
    'Gold': 'ذهبي', 'Beige': 'بيج', 'Yellow': 'أصفر',
};
function buildArabicTitle(listing) {
    if (listing.type === 'PLATE') {
        return `لوحة مميزة ${listing.plateNumber || ''}`.trim();
    }
    if (listing.type === 'BIKE') {
        const brand = listing.make || 'دراجة نارية';
        const model = listing.model || '';
        return `${brand} ${model} - للبيع`.trim();
    }
    const brand = listing.make || '';
    const model = listing.model || '';
    const year = listing.year ? `${listing.year}` : '';
    const parts = [brand, model, year].filter(Boolean);
    return parts.length > 0 ? `${parts.join(' ')} - للبيع` : 'سيارة للبيع';
}
function buildArabicDescription(listing) {
    if (listing.type === 'PLATE') {
        return `لوحة أرقام مميزة ${listing.plateNumber || ''} للبيع. فئة: ${listing.plateCategory || 'خاص'}.`;
    }
    const brand = listing.make || '';
    const model = listing.model || '';
    const year = listing.year ? `موديل ${listing.year}` : '';
    const color = listing.color ? (ARAB_COLORS[listing.color] || listing.color) : '';
    const body = listing.bodyType ? (ARAB_BODY_TYPES[listing.bodyType] || listing.bodyType) : '';
    const km = listing.mileage ? `قطع ${listing.mileage.toLocaleString()} كم` : '';
    const parts = [brand, model, year, color, body, km].filter(Boolean);
    return `${parts.join('، ')} - بحالة ممتازة. للتواصل والاستفسار يرجى الاتصال.`;
}
async function main() {
    console.log('🔄 Backfilling Arabic titles for existing listings...\n');
    const listings = await prisma.listing.findMany({
        where: { titleAr: null },
        select: {
            id: true, title: true, type: true,
            make: true, model: true, year: true,
            color: true, bodyType: true, mileage: true,
            plateNumber: true, plateCategory: true,
        },
    });
    console.log(`Found ${listings.length} listings without Arabic titles`);
    let updated = 0;
    for (const listing of listings) {
        const titleAr = buildArabicTitle(listing);
        const descriptionAr = buildArabicDescription(listing);
        await prisma.listing.update({
            where: { id: listing.id },
            data: { titleAr, descriptionAr },
        });
        updated++;
        if (updated % 10 === 0)
            process.stdout.write(`\r  Updated ${updated}/${listings.length}...`);
    }
    console.log(`\n✅ Done! Updated ${updated} listings with Arabic titles.`);
    await prisma.$disconnect();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=backfill-arabic-titles.js.map