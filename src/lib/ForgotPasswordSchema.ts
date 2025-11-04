import { z } from "zod";
import { signupSchema } from "./SignupSchema";

export const forgotPasswordSchema = z.object({
  email: signupSchema.shape.email,
});
