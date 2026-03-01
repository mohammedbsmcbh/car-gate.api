import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    register(dto: RegisterDto): Promise<import("./dto").RegistrationSuccessDto>;
    login(dto: LoginDto): Promise<import("./dto").AuthResponseDto>;
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
}
