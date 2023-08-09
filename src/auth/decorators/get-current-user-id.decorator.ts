import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadToken } from '../interfaces';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;
    return user.sub;
  },
);
