import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1, "Please enter a password").trim(),
});

export const signUpFormSchema = z.object({
  email: z.string().email().trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email().trim(),
});

export const passwordResetFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .trim(),
    passwordconfirm: z.string().min(8, "Please confirm your password").trim(),
  })
  .refine((data) => data.password === data.passwordconfirm, {
    message: "Passwords do not match",
    path: ["passwordconfirm"],
  });

export type passwordResetFormSchemaType = z.infer<
  typeof passwordResetFormSchema
>;

export type forgotPasswordFormSchemaType = z.infer<
  typeof forgotPasswordFormSchema
>;
export type signInFormSchemaType = z.infer<typeof signInFormSchema>;
export type signUpFormSchemaType = z.infer<typeof signUpFormSchema>;
