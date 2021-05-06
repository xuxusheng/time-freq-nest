import { compare, genSalt, hash } from 'bcrypt';

export async function encodePassword(password: string): Promise<string> {
  const salt = await genSalt();
  return await hash(password, salt);
}

export function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return compare(password, hash);
}
