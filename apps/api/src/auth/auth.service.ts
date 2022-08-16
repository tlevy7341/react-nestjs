import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { SignInDTO, SignUpDTO } from "@nextjs-nestjs/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {}

    async getTokens(id: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            await this.jwtService.signAsync(
                { id, email },
                {
                    secret: this.config.get("ACCESS_TOKEN_SECRET") as string,
                    expiresIn: "5m"
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

    async signIn(credentials: SignInDTO, response) {
        const { email, password } = credentials;
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                password: true,
                email: true,
                avatar: true
            }
        });
        if (!user) throw new ForbiddenException("Credentials Incorrect");

        const isPasswordCorrect = await argon.verify(user.password, password);
        if (!isPasswordCorrect)
            throw new ForbiddenException("Credentials Incorrect");

        const tokens = await this.getTokens(user.id, user.email);

        const hashedRefreshToken = await argon.hash(tokens.refreshToken);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken }
        });

        response.cookie("accessToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        return {
            accessToken: tokens.accessToken,
            id: user.id,
            email: user.email,
            avatar: user.avatar
        };
    }

    async signUp(credentials: SignUpDTO) {
        try {
            const { email, password } = credentials;
            const avatar = createAvatar(style, { dataUri: true, size: 128 });
            const hashedPassword = await argon.hash(password);
            await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    avatar
                }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException(
                        "Unable to create user. Please try again later"
                    );
                }
            }
            throw error;
        }
    }

    async refresh(accessToken: string, res) {
        interface TokenPayload {
            id: number;
        }

        const { id } = (await this.jwtService.decode(
            accessToken
        )) as TokenPayload;

        if (!id) throw new ForbiddenException("Access Denied");

        const user = await this.prisma.user.findFirst({
            where: { id },
            select: {
                id: true,
                refreshToken: true,
                email: true,
                avatar: true
            }
        });

        if (!user) throw new ForbiddenException("Access Denied");

        const isRefreshTokenCorrect = await argon.verify(
            user.refreshToken as string,
            accessToken
        );
        if (!isRefreshTokenCorrect)
            throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.email);

        const hashedRefreshToken = await argon.hash(tokens.refreshToken);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken }
        });

        res.cookie("accessToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        return {
            accessToken: tokens.accessToken,
            id: user.id,
            email: user.email,
            avatar: user.avatar
        };
    }

    async signOut(res, id: number) {
        await this.prisma.user.update({
            where: { id },
            data: { refreshToken: null }
        });

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });
    }
}
