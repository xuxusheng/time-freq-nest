import { User } from '@prisma/client';

export type JwtPayload = Pick<User, 'id'>;
