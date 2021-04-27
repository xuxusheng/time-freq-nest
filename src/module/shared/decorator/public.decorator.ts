import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// 将某个接口，标记为公开，不需要经过 JWTAuthGuard 校验
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
