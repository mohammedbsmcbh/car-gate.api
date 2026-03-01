import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto, RegistrationSuccessDto } from './dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    verifyOtp(email: string, otp: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(dto: any): Promise<{
        success: boolean;
        message: string;
    }>;
    register(dto: RegisterDto): Promise<RegistrationSuccessDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    getMe(userId: string): Promise<{
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        whatsapp: string | null;
        id: string;
        avatar: string | null;
        isApproved: boolean;
        createdAt: Date;
    }>;
    private generateToken;
}
