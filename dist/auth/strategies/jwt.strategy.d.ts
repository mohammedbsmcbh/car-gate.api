import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        isApproved: boolean;
        isActive: boolean;
    } | {
        id: string;
        subAdminId: string;
        email: string;
        name: string;
        role: string;
        isApproved: boolean;
        isActive: true;
        isSubAdmin: boolean;
        showroomId: string;
        agencyId?: undefined;
    } | {
        id: string;
        subAdminId: string;
        email: string;
        name: string;
        role: string;
        isApproved: boolean;
        isActive: true;
        isSubAdmin: boolean;
        agencyId: string;
        showroomId?: undefined;
    }>;
}
export {};
