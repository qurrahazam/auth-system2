import { signupSchema } from "./SignupSchema";
import { z } from "zod";

export const loginSchema = signupSchema
  .pick({ email: true, password: true })
  .extend({
    password: z
      .string()
      .min(1, "Password is required")
  });

