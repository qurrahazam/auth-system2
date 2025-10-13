import { z } from "zod";
import { signupSchema } from "./signupSchema";

export const forgotPasswordSchema = z.object({
  email: signupSchema.shape.email,
});
