import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
    DeleteAccountDTO,
    ForgotPasswordDTO,
    ResetPasswordDTO,
    UpdateAvatarDTO
} from "@nextjs-nestjs/types";
import sgMail from "@sendgrid/mail";
import * as argon from "argon2";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    }

    async getTokens(id: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            await this.jwtService.signAsync(
                { id, email },
                {
                    secret: this.config.get("ACCESS_TOKEN_SECRET") as string,
                    expiresIn: "1m"
                }
            ),
            await this.jwtService.signAsync(
                { id, email },
                {
                    secret: this.config.get("REFRESH_TOKEN_SECRET") as string,
                    expiresIn: "7d"
                }
            )
        ]);
        return { accessToken, refreshToken };
    }

    async updateAvatar(bodyResponse: UpdateAvatarDTO) {
        const { avatar, id } = bodyResponse;
        try {
            await this.prisma.user.update({
                where: { id },
                data: { avatar }
            });
        } catch (error) {
            throw new HttpException(
                "Error updating avatar",
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async forgotPassword(bodyResponse: ForgotPasswordDTO) {
        try {
            const { email } = bodyResponse;

            const user = await this.prisma.user.findUnique({
                where: { email }
            });

            if (!user) return;

            const tokens = await this.getTokens(user.id, user.email);

            await this.prisma.passwordReset.create({
                data: {
                    user_email: email,
                    token: tokens.accessToken
                }
            });

            const passwordResetURL = `${process.env.FRONTEND_URL}/reset-password?token=${tokens.accessToken}`;

            await sgMail.send({
                from: process.env.SENDER_FROM_EMAIL as string,
                to: email,
                subject: "Password Reset",
                text: `Please click the following link to reset your password: ${passwordResetURL}`,
                html: `<p>Please click the following link to reset your password: ${passwordResetURL}</p>`,
                templateId: process.env.SENDGRID_TEMPLATE_ID as string,
                dynamicTemplateData: {
                    button_url: passwordResetURL
                }
            });
        } catch (e) {
            throw new HttpException(
                "Error sending email",
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async resetPassword(bodyResponse: ResetPasswordDTO) {
        try {
            const { accessToken, password } = bodyResponse;

            const user = await this.prisma.passwordReset.findUnique({
                where: { token: accessToken }
            });
            if (!user)
                throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);

            const newPassword = await argon.hash(password);

            await this.prisma.user.update({
                where: { email: user.user_email },
                data: { password: newPassword }
            });

            await this.prisma.passwordReset.delete({
                where: { token: accessToken }
            });
        } catch (e) {
            throw new HttpException(
                "Error resetting password",
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async deleteAccount(bodyResponse: DeleteAccountDTO, res) {
        try {
            const { id } = bodyResponse;
            await this.prisma.user.delete({ where: { id } });
            res.clearCookie("access_token", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000
            });
        } catch (e) {
            throw new HttpException(
                "Error deleting account",
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
