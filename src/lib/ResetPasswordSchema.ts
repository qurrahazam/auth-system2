import { z } from "zod";
import { signupSchema } from "./SignupSchema";

export const resetPasswordSchema = z
  .object({
    newPassword: signupSchema.shape.password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
