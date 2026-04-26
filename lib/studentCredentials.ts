import "server-only";
import { Redis } from "@upstash/redis";
import bcrypt from "bcryptjs";

const BCRYPT_COST = 10;

// Vercel's Upstash integration injects KV_REST_API_URL/TOKEN; bare Upstash
// integrations use UPSTASH_REDIS_REST_URL/TOKEN. Accept either so the same
// code works regardless of how the store was provisioned.
const url =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

let _redis: Redis | null = null;
function redis(): Redis {
  if (!_redis) {
    if (!url || !token) {
      throw new Error(
        "Upstash Redis env vars not set (KV_REST_API_URL/TOKEN or UPSTASH_REDIS_REST_URL/TOKEN).",
      );
    }
    _redis = new Redis({ url, token });
  }
  return _redis;
}

export type StudentCredentials = {
  id: string;
  parent_member_id: string;
  first_name: string;
  last_name: string;
  level: string;
  username: string;
  pin_hash: string;
};

function key(username: string): string {
  return `student:${username.trim().toLowerCase()}`;
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, BCRYPT_COST);
}

export async function comparePin(
  pin: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}

// Returns true on success, false if username is already taken.
export async function writeCredentials(
  credentials: StudentCredentials,
): Promise<boolean> {
  const result = await redis().set(key(credentials.username), credentials, {
    nx: true,
  });
  return result === "OK";
}

export async function readCredentials(
  username: string,
): Promise<StudentCredentials | null> {
  const value = await redis().get<StudentCredentials>(key(username));
  return value ?? null;
}

export async function deleteCredentials(username: string): Promise<void> {
  await redis().del(key(username));
}
