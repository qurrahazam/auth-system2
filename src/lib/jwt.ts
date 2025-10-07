import jwt, { Secret } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "HarryPotter";

export function generateToken(payload: object, expiresIn?: string | number) {
  return jwt.sign(payload, SECRET, { expiresIn: expiresIn ?? "1h" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}