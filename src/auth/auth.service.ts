import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto, RegistrationSuccessDto } from './dto';
import { UserRole } from '@prisma/client';

import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
             return { message: 'If this email exists, an OTP has been sent.' };
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10); // 10 minutes expiry

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

    async verifyOtp(email: string, otp: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
             throw new BadRequestException('Invalid or expired OTP');
        }
        return { success: true, message: 'OTP verified' };
    }

    async resetPassword(dto: any) {
        const { email, otp, newPassword } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        
        if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
             throw new BadRequestException('Invalid or expired OTP');
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

    async register(dto: RegisterDto): Promise<RegistrationSuccessDto> {
        // Check if email exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Prevent direct super admin registration
        if (dto.role === UserRole.SUPER_ADMIN) {
            throw new BadRequestException('Cannot register as Super Admin');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user — INDIVIDUAL auto-approved, everyone else needs admin approval
        const isAutoApproved = dto.role === UserRole.INDIVIDUAL;

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

        // If service provider, create their profile immediately with type
        if (dto.role === UserRole.SERVICE_PROVIDER && dto.serviceProviderType) {
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

        // Return success message - DO NOT return token or auto-login
        // Send registration confirmation email (fire-and-forget)
        this.mailService.sendRegistrationConfirmation(dto.email, dto.name || 'المستخدم').catch(() => null);

        return {
            success: true,
            message: 'Registration successful. Your account is pending admin approval.',
            requiresApproval: true,
        };
    }

    async login(dto: LoginDto): Promise<AuthResponseDto> {
        // 1. Try to find regular user
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
            // Check if account is deactivated
            if (!user.isActive) {
                throw new ForbiddenException('Your account has been deactivated. Please contact support.');
            }

            // Check if account is pending approval
            if (!user.isApproved) {
                throw new ForbiddenException('Your account is pending admin approval. Please wait for confirmation.');
            }

            const isPasswordValid = await bcrypt.compare(dto.password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const accessToken = this.generateToken(user.id, user.email, user.role);

            // Remove password from response
            const { password, isActive, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                accessToken,
            };
        }

        // 2. Try to find Sub-Admin (Showroom)
        const subAdmin = await this.prisma.showroomSubAdmin.findFirst({
            where: { email: dto.email },
            include: { showroom: true } // Need showroom to get Owner ID
        });

        if (subAdmin) {
            if (!subAdmin.isActive) {
                throw new ForbiddenException('Your account has been deactivated.');
            }

            const isPasswordValid = await bcrypt.compare(dto.password, subAdmin.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Sub-admins act as SHOWROOM role
            // Token keeps subAdmin.id as subject (for auditing/tracking)
            const accessToken = this.generateToken(subAdmin.id, subAdmin.email, UserRole.SHOWROOM);

            return {
                user: {
                    id: subAdmin.showroom.userId, // Return Owner ID to frontend so it behaves as Showroom Owner
                    email: subAdmin.email,
                    name: subAdmin.name,
                    role: UserRole.SHOWROOM,
                    isApproved: true, 
                },
                accessToken,
            };
        }

        // 3. Try to find Sub-Admin (Agency)
        const agencySubAdmin = await this.prisma.agencySubAdmin.findFirst({
            where: { email: dto.email },
            include: { agency: true }
        });

        if (agencySubAdmin) {
            if (!agencySubAdmin.isActive) {
                throw new ForbiddenException('Your account has been deactivated.');
            }

            const isPasswordValid = await bcrypt.compare(dto.password, agencySubAdmin.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Sub-admins act as AGENCY role
            const accessToken = this.generateToken(agencySubAdmin.id, agencySubAdmin.email, UserRole.AGENCY);

            return {
                user: {
                    id: agencySubAdmin.agency.userId,
                    email: agencySubAdmin.email,
                    name: agencySubAdmin.name,
                    role: UserRole.AGENCY,
                    isApproved: true, 
                },
                accessToken,
            };
        }

        throw new UnauthorizedException('Invalid credentials');
    }

    async getMe(userId: string) {
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
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    private generateToken(userId: string, email: string, role: UserRole): string {
        return this.jwtService.sign({
            sub: userId,
            email,
            role,
        });
    }
}
