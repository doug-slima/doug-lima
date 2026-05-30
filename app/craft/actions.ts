"use server";

export async function verifyPassword(pwd: string): Promise<boolean> {
  return pwd === process.env.NDA_PASSWORD;
}
