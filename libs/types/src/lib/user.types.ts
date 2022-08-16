import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const UpdateAvatarSchema = z.object({
    avatar: z.string().min(1, "Please provide an avatar"),
    id: z.number().min(1, "Please provide an id")
});

export const DeleteAccountSchema = z.object({
    id: z.number({ required_error: "Please provide an id" })
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email()
});

export const ResetPasswordSchema = z.object({
    accessToken: z.string().min(1, "Please provide an access token"),
    password: z.string().min(1, "Please provide a password")
});

export class UpdateAvatarDTO extends createZodDto(UpdateAvatarSchema) {}
export class DeleteAccountDTO extends createZodDto(DeleteAccountSchema) {}
export class ForgotPasswordDTO extends createZodDto(ForgotPasswordSchema) {}
export class ResetPasswordDTO extends createZodDto(ResetPasswordSchema) {}
