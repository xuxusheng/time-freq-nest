import { User } from '../entitiy';

export type JwtPayload = Pick<User, 'id'>;
