import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

export const SignInShema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Please enter a password")
});

export class SignInDTO extends createZodDto(SignInShema) {}
export class SignUpDTO extends createZodDto(SignUpSchema) {}
