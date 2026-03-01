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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ChatGateway = class ChatGateway {
    jwtService;
    prisma;
    notificationsService;
    server;
    activeUsers = new Map();
    activeInquiries = new Map();
    constructor(jwtService, prisma, notificationsService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            let finalUserId = payload.sub;
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, role: true }
            });
            if (user) {
                finalUserId = user.id;
            }
            else {
                const agencySub = await this.prisma.agencySubAdmin.findUnique({
                    where: { id: payload.sub },
                    include: { agency: true }
                });
                if (agencySub) {
                    finalUserId = agencySub.agency.userId;
                }
                else {
                    const showroomSub = await this.prisma.showroomSubAdmin.findUnique({
                        where: { id: payload.sub },
                        include: { showroom: true }
                    });
                    if (showroomSub) {
                        finalUserId = showroomSub.showroom.userId;
                    }
                }
            }
            client.data.userId = finalUserId;
            if (!this.activeUsers.has(finalUserId)) {
                this.activeUsers.set(finalUserId, new Set());
            }
            this.activeUsers.get(finalUserId).add(client.id);
            client.join(`user_${finalUserId}`);
            console.log(`Client connected: ${client.id}, Sub: ${payload.sub}, RealUser: ${finalUserId}`);
        }
        catch (error) {
            console.error('Connection error:', error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data.userId;
        if (userId) {
            if (this.activeUsers.has(userId)) {
                const sockets = this.activeUsers.get(userId);
                if (sockets) {
                    sockets.delete(client.id);
                    if (sockets.size === 0) {
                        this.activeUsers.delete(userId);
                    }
                }
            }
        }
        this.activeInquiries.delete(client.id);
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoinInquiry(client, inquiryId) {
        client.join(`inquiry_${inquiryId}`);
        this.activeInquiries.set(client.id, inquiryId);
        console.log(`User ${client.data.userId} joined inquiry ${inquiryId}`);
        return { event: 'joined', inquiryId };
    }
    handleChatActive(client, payload) {
        client.data.activeInquiryId = payload.inquiryId;
        this.activeInquiries.set(client.id, payload.inquiryId);
        client.join(`inquiry_${payload.inquiryId}`);
        console.log(`User ${client.data.userId} active in chat ${payload.inquiryId}`);
    }
    handleChatInactive(client, payload) {
        if (client.data.activeInquiryId === payload.inquiryId) {
            delete client.data.activeInquiryId;
        }
        if (this.activeInquiries.get(client.id) === payload.inquiryId) {
            this.activeInquiries.delete(client.id);
        }
        console.log(`User ${client.data.userId} inactive in chat ${payload.inquiryId}`);
    }
    isUserActiveInChat(userId, inquiryId) {
        if (!this.activeUsers.has(userId))
            return false;
        const socketIds = this.activeUsers.get(userId);
        if (!socketIds)
            return false;
        for (const socketId of socketIds) {
            if (this.activeInquiries.get(socketId) === inquiryId) {
                return true;
            }
        }
        return false;
    }
    async handleSendMessage(client, payload) {
        const userId = client.data.userId;
        const message = await this.prisma.inquiryMessage.create({
            data: {
                inquiryId: payload.inquiryId,
                senderId: userId,
                content: payload.content,
            },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true },
                },
            },
        });
        this.server.to(`inquiry_${payload.inquiryId}`).emit('newMessage', message);
        const inquiry = await this.prisma.inquiry.findUnique({
            where: { id: payload.inquiryId },
        });
        if (inquiry) {
            const receiverId = inquiry.senderId === userId ? inquiry.receiverId : inquiry.senderId;
            await this.notificationsService.notifyUser(receiverId, 'CHAT_NEW_MESSAGE', {
                senderName: message.sender.name || 'User',
                inquiryId: payload.inquiryId
            }, { type: 'CHAT' });
        }
        return message;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinInquiry'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinInquiry", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:active'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleChatActive", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:inactive'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleChatInactive", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map