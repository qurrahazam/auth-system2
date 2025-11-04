export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): {valid: boolean; message?: string} | boolean {
    if (password.length < 8) return { valid: false, message: "Password must be at least 8 characters long." };
    if (!/[A-Z]/.test(password)) return { valid: false, message: "Password must contain at least one uppercase letter." };
    if (!/[0-9]/.test(password)) return { valid: false, message: "Password must contain at least one number." };
    return true;
}

export function validateUsername(username: string): { valid: boolean; message?: string } | boolean {
  if (username.trim().length < 3)
    return { valid: false, message: "Username must be at least 3 characters."};
  return { valid: true };
}