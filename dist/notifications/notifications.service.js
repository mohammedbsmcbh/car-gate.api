"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = exports.NOTIFICATION_TEMPLATES = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const chat_gateway_1 = require("../chat/chat.gateway");
const expo_server_sdk_1 = require("expo-server-sdk");
const client_1 = require("@prisma/client");
exports.NOTIFICATION_TEMPLATES = {
    CHAT_NEW_MESSAGE: {
        EN: { title: 'New Message', body: 'You have a new message from {senderName}.' },
        AR: { title: 'رسالة جديدة', body: 'لديك رسالة جديدة من {senderName}.' },
        UR: { title: 'نیا پیغام', body: '{senderName} کی طرف سے آپ کو ایک نیا پیغام موصول ہوا ہے۔' },
    },
    OFFER_RECEIVED: {
        EN: { title: 'New Offer', body: 'You received an offer of {amount} for {listingTitle}.' },
        AR: { title: 'عرض جديد', body: 'لقد تلقيت عرضًا بقيمة {amount} بخصوص {listingTitle}.' },
        UR: { title: 'نئی پیشکش', body: 'آپ کو {listingTitle} کے لیے {amount} کی پیشکش موصول ہوئی ہے۔' },
    },
    OFFER_ACCEPTED: {
        EN: { title: 'Offer Accepted', body: 'Your offer for {listingTitle} was accepted!' },
        AR: { title: 'تم قبول العرض', body: 'تم قبول عرضك بخصوص {listingTitle}!' },
        UR: { title: 'پیشکش قبول کرلی گئی', body: 'آپ کی {listingTitle} کے لیے پیشکش قبول ہو گئی ہے!' },
    },
    OFFER_REJECTED: {
        EN: { title: 'Offer Rejected', body: 'Your offer for {listingTitle} was rejected.' },
        AR: { title: 'تم رفض العرض', body: 'تم رفض عرضك بخصوص {listingTitle}.' },
        UR: { title: 'پیشکش مسترد', body: 'آپ کی {listingTitle} کے لیے پیشکش مسترد کر دی گئی ہے۔' },
    },
    LISTING_APPROVED: {
        EN: { title: 'Listing Approved', body: 'Your listing "{listingTitle}" is now live!' },
        AR: { title: 'تمت الموافقة على الإعلان', body: 'إعلانك "{listingTitle}" أصبح متاحًا الآن!' },
        UR: { title: 'فہرست منظور', body: 'آپ کی فہرست "{listingTitle}" اب لائیو ہے!' },
    },
    LISTING_REJECTED: {
        EN: { title: 'Listing Rejected', body: 'Your listing "{listingTitle}" was rejected. Please check details.' },
        AR: { title: 'تم رفض الإعلان', body: 'تم رفض إعلانك "{listingTitle}". يرجى التحقق من التفاصيل.' },
        UR: { title: 'فہرست مسترد', body: 'آپ کی فہرست "{listingTitle}" مسترد کر دی گئی ہے۔ تفصیلات چیک کریں۔' },
    },
    NEW_LISTING_PUBLISHED: {
        EN: { title: 'New Car Available', body: 'Check out the new {make} {model} added recently!' },
        AR: { title: 'سيارة جديدة متاحة', body: 'تفقّد {make} {model} الجديدة التي تمت إضافتها مؤخرًا!' },
        UR: { title: 'نئی کار دستیاب', body: 'حال ہی میں شامل کی گئی {make} {model} چیک کریں!' },
    },
    NEW_BANNER: {
        EN: { title: 'Special Offer', body: '{bannerTitle}' },
        AR: { title: 'عرض خاص', body: '{bannerTitle}' },
        UR: { title: 'خصوصی پیشکش', body: '{bannerTitle}' },
    },
    STORY_APPROVED: {
        EN: { title: 'New Story', body: '{userName} posted a new story.' },
        AR: { title: 'قصة جديدة', body: 'نشر {userName} قصة جديدة.' },
        UR: { title: 'نئی کہانی', body: '{userName} نے ایک نئی کہانی پوسٹ کی ہے۔' },
    },
    MARKETING_BROADCAST: {
        EN: { title: '{title}', body: '{body}' },
        AR: { title: '{title}', body: '{body}' },
        UR: { title: '{title}', body: '{body}' },
    }
};
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    chatGateway;
    expo = new expo_server_sdk_1.Expo();
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma, chatGateway) {
        this.prisma = prisma;
        this.chatGateway = chatGateway;
    }
    replacePlaceholders(text, data) {
        return text.replace(/{(\w+)}/g, (_, key) => data[key] || '');
    }
    getTemplate(key, lang) {
        const templateGroup = exports.NOTIFICATION_TEMPLATES[key];
        const template = templateGroup[lang] || templateGroup['EN'];
        return template;
    }
    async notifyUser(userId, templateKey, data = {}, options = {}) {
        const type = options.type || 'SYSTEM';
        const isChat = type === 'CHAT';
        const isMarketing = type === 'MARKETING' || type === 'BANNER';
        const isSystem = !isChat && !isMarketing;
        this.chatGateway.server.to(`user_${userId}`).emit('notification', {
            title: null,
            body: null,
            type: type,
            data,
            isRealTime: true
        });
        if (isChat && data.inquiryId) {
            if (this.chatGateway.isUserActiveInChat(userId, data.inquiryId)) {
                this.logger.log(`Skipping push/DB for user ${userId} active in chat ${data.inquiryId}`);
                return;
            }
        }
        const deviceWhere = { userId, isActive: true };
        if (isMarketing)
            deviceWhere.optedInMarketing = true;
        if (isSystem)
            deviceWhere.optedInSystem = true;
        const devices = await this.prisma.device.findMany({
            where: deviceWhere,
        });
        const messages = [];
        for (const device of devices) {
            if (!expo_server_sdk_1.Expo.isExpoPushToken(device.pushToken))
                continue;
            const { title, body } = this.getTemplate(templateKey, device.language);
            const finalTitle = this.replacePlaceholders(title, data);
            const finalBody = this.replacePlaceholders(body, data);
            messages.push({
                to: device.pushToken,
                sound: 'default',
                title: finalTitle,
                body: finalBody,
                data: { ...data, type: options.type || 'SYSTEM' },
            });
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { preferredLanguage: true } });
        const { title, body } = this.getTemplate(templateKey, user?.preferredLanguage || client_1.Language.EN);
        await this.prisma.notification.create({
            data: {
                userId,
                title: this.replacePlaceholders(title, data),
                body: this.replacePlaceholders(body, data),
                type: options.type || 'SYSTEM',
                data: data,
                isRead: false,
            }
        });
        if (messages.length > 0) {
            this.sendChunks(messages);
        }
    }
    async broadcast(templateKey, data = {}, filters = {}) {
        const where = { isActive: true };
        if (filters.role) {
            where.user = { role: filters.role };
        }
        if (filters.language) {
            where.language = filters.language;
        }
        const type = (data.type || 'SYSTEM');
        const isChat = type === 'CHAT';
        const isMarketing = type === 'MARKETING' || type === 'BANNER';
        const isSystem = !isChat && !isMarketing;
        if (isChat)
            where.optedInChat = true;
        if (isMarketing)
            where.optedInMarketing = true;
        if (isSystem)
            where.optedInSystem = true;
        const devices = await this.prisma.device.findMany({
            where,
            select: { pushToken: true, language: true, userId: true }
        });
        if (devices.length === 0)
            return;
        const messages = [];
        const userLangMap = new Map();
        for (const device of devices) {
            if (!expo_server_sdk_1.Expo.isExpoPushToken(device.pushToken))
                continue;
            const { title, body } = this.getTemplate(templateKey, device.language);
            messages.push({
                to: device.pushToken,
                sound: 'default',
                title: this.replacePlaceholders(title, data),
                body: this.replacePlaceholders(body, data),
                data: { ...data, type: 'BROADCAST' },
            });
            if (device.userId) {
                if (!userLangMap.has(device.userId)) {
                    userLangMap.set(device.userId, device.language);
                }
            }
        }
        this.sendChunks(messages);
        const notificationRecords = [];
        for (const [uid, lang] of userLangMap.entries()) {
            const { title, body } = this.getTemplate(templateKey, lang);
            notificationRecords.push({
                userId: uid,
                title: this.replacePlaceholders(title, data),
                body: this.replacePlaceholders(body, data),
                type: 'SYSTEM',
                data: { ...data, type: 'BROADCAST' },
                isRead: false,
                createdAt: new Date(),
            });
        }
        if (notificationRecords.length > 0) {
            const batchSize = 1000;
            for (let i = 0; i < notificationRecords.length; i += batchSize) {
                const batch = notificationRecords.slice(i, i + batchSize);
                await this.prisma.notification.createMany({
                    data: batch,
                    skipDuplicates: true,
                });
            }
        }
    }
    async sendChunks(messages) {
        const chunks = this.expo.chunkPushNotifications(messages);
        for (const chunk of chunks) {
            try {
                await this.expo.sendPushNotificationsAsync(chunk);
            }
            catch (error) {
                this.logger.error('Error sending push chunk', error);
            }
        }
    }
    async registerDevice(token, platform, language, userId) {
        if (!expo_server_sdk_1.Expo.isExpoPushToken(token)) {
            throw new Error('Invalid Expo Push Token');
        }
        const deviceData = {
            pushToken: token,
            platform: platform || 'unknown',
            language: language || client_1.Language.EN,
            userId: userId || null,
            isActive: true,
        };
        return this.prisma.device.upsert({
            where: { pushToken: token },
            create: {
                ...deviceData,
                optedInChat: true,
                optedInSystem: true,
                optedInMarketing: true,
            },
            update: {
                lastActiveAt: new Date(),
                userId: userId || null,
                language: language || undefined,
                isActive: true,
            },
        });
    }
    async sendAdminNotification(filters, title, body, data = {}) {
        let tokens = [];
        let userIdsToNotify = [];
        const type = data.type || 'SYSTEM';
        const isMarketing = type === 'MARKETING' || type === 'BANNER';
        if (filters.role === 'ALL') {
            const deviceWhere = { isActive: true };
            if (filters.language && filters.language !== 'ALL') {
                deviceWhere.language = filters.language;
            }
            if (isMarketing) {
                deviceWhere.optedInMarketing = true;
            }
            else {
                deviceWhere.optedInSystem = true;
            }
            const devices = await this.prisma.device.findMany({
                where: deviceWhere,
                select: { pushToken: true, userId: true },
            });
            tokens = devices.map(d => d.pushToken);
            userIdsToNotify = devices.filter(d => d.userId).map(d => d.userId);
        }
        else {
            const userWhere = {
                isActive: true,
                role: filters.role,
            };
            if (filters.language && filters.language !== 'ALL') {
                userWhere.preferredLanguage = filters.language;
            }
            const users = await this.prisma.user.findMany({
                where: userWhere,
                select: { id: true },
            });
            const foundUserIds = users.map(u => u.id);
            const deviceWhere = {
                userId: { in: foundUserIds },
                isActive: true
            };
            if (isMarketing) {
                deviceWhere.optedInMarketing = true;
            }
            else {
                deviceWhere.optedInSystem = true;
            }
            const devices = await this.prisma.device.findMany({
                where: deviceWhere,
                select: { pushToken: true, userId: true }
            });
            tokens = devices.map(d => d.pushToken);
            userIdsToNotify = foundUserIds;
        }
        tokens = [...new Set(tokens)];
        if (tokens.length === 0) {
            return { targeted: 0, sentCount: 0 };
        }
        const messages = [];
        for (const token of tokens) {
            if (expo_server_sdk_1.Expo.isExpoPushToken(token)) {
                messages.push({
                    to: token,
                    sound: 'default',
                    title,
                    body,
                    data,
                });
            }
        }
        const notificationRecords = userIdsToNotify.map(uid => ({
            userId: uid,
            title,
            body,
            type: 'SYSTEM',
            data,
            isRead: false,
            createdAt: new Date(),
        }));
        const chunks = this.expo.chunkPushNotifications(messages);
        let sentCount = 0;
        for (const chunk of chunks) {
            try {
                await this.expo.sendPushNotificationsAsync(chunk);
                sentCount += chunk.length;
            }
            catch (error) {
                this.logger.error('Error sending admin push chunk', error);
            }
        }
        if (notificationRecords.length > 0) {
            await this.prisma.notification.createMany({
                data: notificationRecords,
                skipDuplicates: true,
            });
            for (const uid of userIdsToNotify) {
                this.chatGateway.server.to(`user_${uid}`).emit('notification', {
                    title,
                    body,
                    type: 'SYSTEM',
                    data
                });
            }
        }
        return { targeted: tokens.length, sentCount };
    }
    async create(userId, title, body, type, data) {
        const notification = await this.prisma.notification.create({
            data: {
                userId,
                title,
                body,
                type,
                data: data || {},
            },
        });
        this.chatGateway.server.to(`user_${userId}`).emit('notification', notification);
        this.sendPushNotification(userId, title, body, data);
        return notification;
    }
    async sendPushNotification(userId, title, body, data) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { pushToken: true },
            });
            if (!user?.pushToken || !expo_server_sdk_1.Expo.isExpoPushToken(user.pushToken)) {
                return;
            }
            const messages = [{
                    to: user.pushToken,
                    sound: 'default',
                    title,
                    body,
                    data: data || {},
                }];
            const chunks = this.expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
                try {
                    await this.expo.sendPushNotificationsAsync(chunk);
                }
                catch (error) {
                    this.logger.error('Error sending push notification chunk', error);
                }
            }
        }
        catch (error) {
            this.logger.error(`Failed to send push notification to user ${userId}`, error);
        }
    }
    async findAll(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async markAsRead(id, userId) {
        return this.prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_gateway_1.ChatGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map