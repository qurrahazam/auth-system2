import jwt, { SignOptions } from "jsonwebtoken";

const SECRET = (process.env.JWT_SECRET || "HarryPotter") as string;

export function generateToken(payload: object, expiresIn?: jwt.SignOptions['expiresIn']) {
  const options: SignOptions = { expiresIn: expiresIn ?? "1h" };
  return jwt.sign(payload, SECRET, options);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string };
  } catch {
    return null;
  }
}
