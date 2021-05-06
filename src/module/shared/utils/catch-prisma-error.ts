import { Prisma } from '@prisma/client';

import { NotFoundException } from '../../core/exception';

export function catchPrismaNotFoundError(err: Error, msg = '') {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2025' // An operation failed because it depends on one or more records that were required but not found. {cause}
  ) {
    throw new NotFoundException(msg);
  }
  throw err;
}
