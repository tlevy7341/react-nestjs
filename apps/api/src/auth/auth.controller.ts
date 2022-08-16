import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
    UsePipes
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SignInDTO, SignUpDTO } from "@nextjs-nestjs/types";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ZodValidationPipe(SignInDTO))
    @Post("signin")
    @HttpCode(HttpStatus.OK)
    async signIn(
        @Body() credentials: SignInDTO,
        @Res({ passthrough: true }) response
    ) {
        return this.authService.signIn(credentials, response);
    }

    @UsePipes(new ZodValidationPipe(SignUpDTO))
    @Post("signup")
    signUp(@Body() credentials: SignUpDTO) {
        return this.authService.signUp(credentials);
    }

    @UseGuards(AuthGuard("jwt-refresh"))
    @Get("refresh")
    @HttpCode(HttpStatus.OK)
    refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const accessToken = req["user"]["accessToken"];
        return this.authService.refresh(accessToken, res);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch("signout")
    @HttpCode(HttpStatus.OK)
    signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userId = req["user"];
        return this.authService.signOut(res, userId);
    }
}
