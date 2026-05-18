import "server-only";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const BCRYPT_COST = 10;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export type StudentCredentials = {
  id: string;
  parent_member_id: string;
  first_name: string;
  last_name: string;
  level: string;
  username: string;
  pin_hash: string;
};

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
  const { error } = await supabase.from("student_credentials").insert({
    username: credentials.username.trim().toLowerCase(),
    pin_hash: credentials.pin_hash,
    parent_member_id: credentials.parent_member_id,
    first_name: credentials.first_name,
    last_name: credentials.last_name,
    level: credentials.level,
  });

  if (error) {
    // Postgres unique violation = username already taken
    if (error.code === "23505") return false;
    throw new Error(`writeCredentials: ${error.message}`);
  }
  return true;
}

export async function readCredentials(
  username: string,
): Promise<StudentCredentials | null> {
  const { data, error } = await supabase
    .from("student_credentials")
    .select("*")
    .eq("username", username.trim().toLowerCase())
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`readCredentials: ${error.message}`);
  }

  return data
    ? {
        id: data.id as string,
        username: data.username as string,
        pin_hash: data.pin_hash as string,
        parent_member_id: data.parent_member_id as string,
        first_name: data.first_name as string,
        last_name: data.last_name as string,
        level: data.level as string,
      }
    : null;
}

export async function deleteCredentials(username: string): Promise<void> {
  await supabase
    .from("student_credentials")
    .delete()
    .eq("username", username.trim().toLowerCase());
}
