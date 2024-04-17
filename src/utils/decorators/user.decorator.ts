import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUserId = createParamDecorator(
  (data: never, context: ExecutionContext): number => {
    const req = context.switchToHttp().getRequest();
    return req.user.id;
  },
);

export const AuthUser = createParamDecorator(
  (data: never, context: ExecutionContext): number => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
