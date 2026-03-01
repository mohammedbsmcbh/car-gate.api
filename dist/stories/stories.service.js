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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
let StoriesService = class StoriesService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, createStoryDto) {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return this.prisma.story.create({
            data: {
                userId,
                ...createStoryDto,
                expiresAt,
                status: client_1.ApprovalStatus.PENDING,
            },
        });
    }
    async findAllPending() {
        return this.prisma.story.findMany({
            where: {
                status: client_1.ApprovalStatus.PENDING,
                expiresAt: { gt: new Date() },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        agency: { select: { logo: true, name: true } },
                        showroom: { select: { logo: true, name: true } },
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateStatus(id, status) {
        const story = await this.prisma.story.update({
            where: { id },
            data: { status },
            include: { user: true }
        });
        if (status === client_1.ApprovalStatus.APPROVED) {
            await this.notificationsService.broadcast('STORY_APPROVED', { userName: story.user.name || 'User', storyId: story.id });
        }
        return story;
    }
    async findAllActive(role) {
        const now = new Date();
        let userFilter = undefined;
        if (role === 'AGENCY') {
            userFilter = { role: client_1.UserRole.AGENCY };
        }
        else if (role === 'SHOWROOM') {
            userFilter = { role: client_1.UserRole.SHOWROOM };
        }
        else if (role === 'INDIVIDUAL') {
            userFilter = { role: { in: [client_1.UserRole.INDIVIDUAL, client_1.UserRole.TRADER] } };
        }
        else if (role === 'CUSTOMS_CLEARER') {
            userFilter = { role: client_1.UserRole.SERVICE_PROVIDER, serviceProvider: { type: client_1.ServiceProviderType.CUSTOMS_CLEARER } };
        }
        else if (role === 'INSPECTION_CENTER') {
            userFilter = { role: client_1.UserRole.SERVICE_PROVIDER, serviceProvider: { type: client_1.ServiceProviderType.INSPECTION_CENTER } };
        }
        else if (role === 'POLISHING_CENTER') {
            userFilter = { role: client_1.UserRole.SERVICE_PROVIDER, serviceProvider: { type: client_1.ServiceProviderType.POLISHING_CENTER } };
        }
        return this.prisma.story.findMany({
            where: {
                expiresAt: { gt: now },
                status: client_1.ApprovalStatus.APPROVED,
                user: userFilter,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                        agency: { select: { logo: true, name: true, coverImage: true } },
                        showroom: { select: { logo: true, name: true, coverImage: true } },
                        serviceProvider: { select: { type: true, name: true, nameAr: true, logo: true } },
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findMyStories(userId) {
        return this.prisma.story.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.StoriesService = StoriesService;
exports.StoriesService = StoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], StoriesService);
//# sourceMappingURL=stories.service.js.map