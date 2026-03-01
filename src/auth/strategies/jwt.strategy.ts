import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.secret') || 'default-secret-key',
        });
    }

    async validate(payload: JwtPayload) {
        // 1. Try to find regular user
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isApproved: true,
                isActive: true,
            },
        });

        if (user) {
            if (!user.isActive) throw new UnauthorizedException('User is inactive');
            return user;
        }

        // 2. Try to find Showroom Sub-Admin
        const subAdmin = await this.prisma.showroomSubAdmin.findUnique({
            where: { id: payload.sub },
            include: {
                showroom: true // Include showroom to get owner ID (userId)
            }
        });

        if (subAdmin) {
            if (!subAdmin.isActive) throw new UnauthorizedException('User is inactive');
            
            // CRITICAL: We map the "User ID" to the Showroom Owner's ID.
            // This ensures all services (Listings, Profile, etc.) look up the *Showroom's* data,
            // not a non-existent User record for the SubAdmin.
            return {
                id: subAdmin.showroom.userId, // <--- Act as the Owner
                subAdminId: subAdmin.id,      // Keep track of real identity
                email: subAdmin.email,
                name: subAdmin.name,
                role: 'SHOWROOM',
                isApproved: true,
                isActive: subAdmin.isActive,
                isSubAdmin: true,
                showroomId: subAdmin.showroomId
            };
        }

        // 3. Try to find Agency Sub-Admin
        const agencySubAdmin = await this.prisma.agencySubAdmin.findUnique({
            where: { id: payload.sub },
            include: {
                agency: true
            }
        });

        if (agencySubAdmin) {
            if (!agencySubAdmin.isActive) throw new UnauthorizedException('User is inactive');
            
            return {
                id: agencySubAdmin.agency.userId,
                subAdminId: agencySubAdmin.id,
                email: agencySubAdmin.email,
                name: agencySubAdmin.name,
                role: 'AGENCY',
                isApproved: true,
                isActive: agencySubAdmin.isActive,
                isSubAdmin: true,
                agencyId: agencySubAdmin.agencyId
            };
        }

        throw new UnauthorizedException('User not found or inactive');
    }
}
