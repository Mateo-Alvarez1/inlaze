import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { user } = req;

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    return user;
  },
);
