import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { UserRole, Language, Device, Prisma } from '@prisma/client';

export const NOTIFICATION_TEMPLATES = {
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

export type TemplateKey = keyof typeof NOTIFICATION_TEMPLATES;

@Injectable()
export class NotificationsService {
  private expo = new Expo();
  private logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  private replacePlaceholders(text: string, data: any): string {
    return text.replace(/{(\w+)}/g, (_, key) => data[key] || '');
  }

  private getTemplate(key: TemplateKey, lang: Language): { title: string; body: string } {
    const templateGroup = NOTIFICATION_TEMPLATES[key];
    const template = templateGroup[lang] || templateGroup['EN'];
    return template;
  }

  async notifyUser(userId: string, templateKey: TemplateKey, data: any = {}, options: any = {}) {
    
    // Check Opt-in
    const type = options.type || 'SYSTEM';
    const isChat = type === 'CHAT';
    const isMarketing = type === 'MARKETING' || type === 'BANNER';
    const isSystem = !isChat && !isMarketing;

    // 0. Always emit real-time socket notification
    // The client handles whether to show a toast or just update UI
    this.chatGateway.server.to(`user_${userId}`).emit('notification', {
        title: null, // Let client decide or fetch
        body: null,
        type: type,
        data,
        isRealTime: true
    });

    // Presence Check for Chat
    if (isChat && data.inquiryId) {
        if (this.chatGateway.isUserActiveInChat(userId, data.inquiryId)) {
             this.logger.log(`Skipping push/DB for user ${userId} active in chat ${data.inquiryId}`);
             return;
        }
    }

    const deviceWhere: any = { userId, isActive: true };
    if (isMarketing) deviceWhere.optedInMarketing = true;
    if (isSystem) deviceWhere.optedInSystem = true;

    // 1. Fetch user devices
    const devices = await this.prisma.device.findMany({
      where: deviceWhere,
    });

    const messages: ExpoPushMessage[] = [];
    
    // Prepare push messages
    for (const device of devices) {
      if (!Expo.isExpoPushToken(device.pushToken)) continue;
      
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

    // Prepare DB Record (User preferred language for history, or default EN)
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { preferredLanguage: true }});
    const { title, body } = this.getTemplate(templateKey, user?.preferredLanguage || Language.EN);
    
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

    // Valid push notifications
    if (messages.length > 0) {
      this.sendChunks(messages);
    }
  }

  async broadcast(templateKey: TemplateKey, data: any = {}, filters: { role?: UserRole, language?: Language } = {}) {
     // 1. Build Query
     const where: any = { isActive: true };
     
     if (filters.role) {
       // If role is specified, we must join with User
       where.user = { role: filters.role };
     }
     
     if (filters.language) {
       where.language = filters.language;
     }

     const type = (data.type || 'SYSTEM') as string;
     const isChat = type === 'CHAT';
     const isMarketing = type === 'MARKETING' || type === 'BANNER';
     const isSystem = !isChat && !isMarketing;

     if (isChat) where.optedInChat = true;
     if (isMarketing) where.optedInMarketing = true;
     if (isSystem) where.optedInSystem = true;

     // 2. Fetch all matching devices
     const devices = await this.prisma.device.findMany({
       where,
       select: { pushToken: true, language: true, userId: true }
     });

     if (devices.length === 0) return;

     const messages: ExpoPushMessage[] = [];
     const userLangMap = new Map<string, Language>();

     // 3. Prepare messages
     for (const device of devices) {
        if (!Expo.isExpoPushToken(device.pushToken)) continue;

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

     // 4. Send Push
     this.sendChunks(messages);

     // 5. DB Records - Batch Insert (One per User)
     const notificationRecords: Prisma.NotificationCreateManyInput[] = [];
     for (const [uid, lang] of userLangMap.entries()) {
          const { title, body } = this.getTemplate(templateKey, lang);
          notificationRecords.push({
              userId: uid,
              title: this.replacePlaceholders(title, data),
              body: this.replacePlaceholders(body, data),
              type: 'SYSTEM', // Broadcasts are usually system alerts
              data: { ...data, type: 'BROADCAST' },
              isRead: false,
              createdAt: new Date(), // Explicit timestamp for createMany
          });
     }

     if (notificationRecords.length > 0) {
          // Process in chunks of 1000 to be safe
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

  private async sendChunks(messages: ExpoPushMessage[]) {
    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        this.logger.error('Error sending push chunk', error);
      }
    }
  }

  async registerDevice(token: string, platform: string, language: any, userId?: string) {
    if (!Expo.isExpoPushToken(token)) {
      throw new Error('Invalid Expo Push Token');
    }

    // Default flags to true for new devices
    const deviceData = {
        pushToken: token,
        platform: platform || 'unknown',
        language: (language as Language) || Language.EN,
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
        language: (language as Language) || undefined,
        isActive: true,
      },
    });
  }

  async sendAdminNotification(
        filters: { role?: UserRole | 'ALL'; language?: Language | 'ALL' },
        title: string,
        body: string,
        data: any = {},
    ) {
        let tokens: string[] = [];
        let userIdsToNotify: string[] = [];

        const type = data.type || 'SYSTEM'; // Default to SYSTEM if not specified
        const isMarketing = type === 'MARKETING' || type === 'BANNER';

        // 1. If sending to ALL (including Guests), query the Device table
        if (filters.role === 'ALL') {
             const deviceWhere: any = { isActive: true };
             if (filters.language && filters.language !== 'ALL') {
                 deviceWhere.language = filters.language;
             }
             
             // Check Opt-in
             if (isMarketing) {
                 deviceWhere.optedInMarketing = true;
             } else {
                 deviceWhere.optedInSystem = true;
             }

             const devices = await this.prisma.device.findMany({
                 where: deviceWhere,
                 select: { pushToken: true, userId: true },
             });

             tokens = devices.map(d => d.pushToken);
             userIdsToNotify = devices.filter(d => d.userId).map(d => d.userId!);
        } 
        // 2. If filtering by Role, we must query Users first, then get their tokens
        else {
            const userWhere: any = {
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
            
            // Find Devices for these users
            const deviceWhere: any = { 
                userId: { in: foundUserIds }, 
                isActive: true 
            };

            // Check Opt-in
            if (isMarketing) {
                 deviceWhere.optedInMarketing = true;
            } else {
                 deviceWhere.optedInSystem = true;
            }

            const devices = await this.prisma.device.findMany({
                where: deviceWhere,
                select: { pushToken: true, userId: true }
            });

            tokens = devices.map(d => d.pushToken);
            userIdsToNotify = foundUserIds;
        }

        // Remove duplicates
        tokens = [...new Set(tokens)];
        
        if (tokens.length === 0) {
            return { targeted: 0, sentCount: 0 };
        }

        // Prepare push messages
        const messages: any[] = [];
        for (const token of tokens) {
           if (Expo.isExpoPushToken(token)) {
                messages.push({
                    to: token,
                    sound: 'default',
                    title,
                    body,
                    data,
                });
           }
        }

        // Prepare DB records (Only for registered users)
        // Guests cannot have "in-app" notifications in the database since they have no User ID
        const notificationRecords = userIdsToNotify.map(uid => ({
            userId: uid,
            title,
            body,
            type: 'SYSTEM',
            data,
            isRead: false,
            createdAt: new Date(),
        }));

        // Send Chunks
        const chunks = this.expo.chunkPushNotifications(messages);
        let sentCount = 0;

        for (const chunk of chunks) {
            try {
                await this.expo.sendPushNotificationsAsync(chunk);
                sentCount += chunk.length;
            } catch (error) {
                this.logger.error('Error sending admin push chunk', error);
            }
        }

        // Bulk insert notifications to DB (for history)
        if (notificationRecords.length > 0) {
            await this.prisma.notification.createMany({
                data: notificationRecords,
                skipDuplicates: true, 
            });
            
             // Send socket event to online users
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

  async create(userId: string, title: string, body: string, type: string, data?: any) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        body,
        type,
        data: data || {},
      },
    });

    // Send real-time notification (Socket.IO)
    this.chatGateway.server.to(`user_${userId}`).emit('notification', notification);

    // Send Push Notification
    this.sendPushNotification(userId, title, body, data);

    return notification;
  }

  async sendPushNotification(userId: string, title: string, body: string, data?: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { pushToken: true },
      });

      if (!user?.pushToken || !Expo.isExpoPushToken(user.pushToken)) {
        return;
      }

      const messages = [{
        to: user.pushToken,
        sound: 'default',
        title,
        body,
        data: data || {},
      }];

      const chunks = this.expo.chunkPushNotifications(messages as any);
      
      for (const chunk of chunks) {
        try {
          await this.expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          this.logger.error('Error sending push notification chunk', error);
        }
      }
    } catch (error) {
       this.logger.error(`Failed to send push notification to user ${userId}`, error);
    }
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
