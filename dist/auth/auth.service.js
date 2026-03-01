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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailService;
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'If this email exists, an OTP has been sent.' };
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpiresAt
            }
        });
        await this.mailService.sendOtpEmail(email, otp);
        return { message: 'OTP sent successfully' };
    }
    async verifyOtp(email, otp) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        return { success: true, message: 'OTP verified' };
    }
    async resetPassword(dto) {
        const { email, otp, newPassword } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                otp: null,
                otpExpiresAt: null
            }
        });
        return { success: true, message: 'Password reset successfully' };
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        if (dto.role === client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.BadRequestException('Cannot register as Super Admin');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const isAutoApproved = dto.role === client_1.UserRole.INDIVIDUAL;
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                role: dto.role,
                phone: dto.phone,
                whatsapp: dto.whatsapp,
                commercialRecord: dto.commercialRecord,
                isApproved: isAutoApproved,
                ...(dto.preferredLanguage ? { preferredLanguage: dto.preferredLanguage } : {}),
            },
        });
        if (dto.role === client_1.UserRole.SERVICE_PROVIDER && dto.serviceProviderType) {
            await this.prisma.serviceProvider.create({
                data: {
                    userId: user.id,
                    type: dto.serviceProviderType,
                    phone: dto.phone,
                    whatsapp: dto.whatsapp,
                },
            });
        }
        if (isAutoApproved) {
            return {
                success: true,
                message: 'Registration successful.',
                requiresApproval: false,
            };
        }
        this.mailService.sendRegistrationConfirmation(dto.email, dto.name || 'المستخدم').catch(() => null);
        return {
            success: true,
            message: 'Registration successful. Your account is pending admin approval.',
            requiresApproval: true,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password: true,
                isApproved: true,
                isActive: true,
                avatar: true,
                coverImage: true,
            },
        });
        if (user) {
            if (!user.isActive) {
                throw new common_1.ForbiddenException('Your account has been deactivated. Please contact support.');
            }
            if (!user.isApproved) {
                throw new common_1.ForbiddenException('Your account is pending admin approval. Please wait for confirmation.');
            }
            const isPasswordValid = await bcrypt.compare(dto.password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const accessToken = this.generateToken(user.id, user.email, user.role);
            const { password, isActive, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                accessToken,
            };
        }
        const subAdmin = await this.prisma.showroomSubAdmin.findFirst({
            where: { email: dto.email },
            include: { showroom: true }
        });
        if (subAdmin) {
            if (!subAdmin.isActive) {
                throw new common_1.ForbiddenException('Your account has been deactivated.');
            }
            const isPasswordValid = await bcrypt.compare(dto.password, subAdmin.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const accessToken = this.generateToken(subAdmin.id, subAdmin.email, client_1.UserRole.SHOWROOM);
            return {
                user: {
                    id: subAdmin.showroom.userId,
                    email: subAdmin.email,
                    name: subAdmin.name,
                    role: client_1.UserRole.SHOWROOM,
                    isApproved: true,
                },
                accessToken,
            };
        }
        const agencySubAdmin = await this.prisma.agencySubAdmin.findFirst({
            where: { email: dto.email },
            include: { agency: true }
        });
        if (agencySubAdmin) {
            if (!agencySubAdmin.isActive) {
                throw new common_1.ForbiddenException('Your account has been deactivated.');
            }
            const isPasswordValid = await bcrypt.compare(dto.password, agencySubAdmin.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const accessToken = this.generateToken(agencySubAdmin.id, agencySubAdmin.email, client_1.UserRole.AGENCY);
            return {
                user: {
                    id: agencySubAdmin.agency.userId,
                    email: agencySubAdmin.email,
                    name: agencySubAdmin.name,
                    role: client_1.UserRole.AGENCY,
                    isApproved: true,
                },
                accessToken,
            };
        }
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                whatsapp: true,
                avatar: true,
                isApproved: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    generateToken(userId, email, role) {
        return this.jwtService.sign({
            sub: userId,
            email,
            role,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map