import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must not exceed 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  
  email: z.string().email("Invalid email address."),

  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must be at least 8 characters long and include at least one uppercase letter and one number."
    ),
});

export type SignupFormData = z.infer<typeof signupSchema>;
