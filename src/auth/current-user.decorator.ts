import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Profile } from '@prisma/client';

/**
 * @CurrentUser() — extracts the authenticated Profile from request.user
 * Populated by JwtStrategy after JWT validation.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Profile => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as Profile;
  },
);
