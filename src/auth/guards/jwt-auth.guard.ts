import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // We do NOT optimize early return for public here because we want to try to extract the user
        // if a token is present, even for public routes (e.g. to check "isLiked").
        // We rely on handleRequest to prevent throwing errors for public routes.
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (user) return user;

        if (isPublic) {
            return null;
        }

        throw err || new UnauthorizedException();
    }
}
