"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const STORY_IMAGES = [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
];
const CAPTIONS = [
    'سيارة رائعة للبيع 🚗',
    'عرض خاص لفترة محدودة! 🔥',
    'أحدث موديلات 2025 وصلت 🎉',
    'تشكيلة واسعة من السيارات الفاخرة ✨',
    'أسعار لا تُضاهى في البحرين 🇧🇭',
];
async function main() {
    console.log('🌱 Seeding stories...');
    const users = await prisma.user.findMany({
        where: { isApproved: true },
        take: 5,
        orderBy: { createdAt: 'asc' },
    });
    if (users.length === 0) {
        console.log('❌ No approved users found. Please approve some users first.');
        return;
    }
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    for (let i = 0; i < Math.min(5, users.length); i++) {
        const user = users[i];
        await prisma.story.create({
            data: {
                userId: user.id,
                mediaUrl: STORY_IMAGES[i],
                mediaType: 'IMAGE',
                caption: CAPTIONS[i],
                status: client_1.ApprovalStatus.APPROVED,
                expiresAt,
            },
        });
        console.log(`✅ Story ${i + 1} created for user: ${user.name || user.email}`);
    }
    console.log('\n✅ Done! 5 test stories created.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-stories.js.map