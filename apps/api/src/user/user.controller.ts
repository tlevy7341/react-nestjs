import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Res,
    UseGuards,
    UsePipes
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
    DeleteAccountDTO,
    ForgotPasswordDTO,
    ResetPasswordDTO,
    UpdateAvatarDTO
} from "@nextjs-nestjs/types";
import { ZodValidationPipe } from "nestjs-zod";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UsePipes(new ZodValidationPipe(UpdateAvatarDTO))
    @Patch("update-avatar")
    @HttpCode(HttpStatus.OK)
    updateAvatar(@Body() bodyResponse: UpdateAvatarDTO) {
        return this.userService.updateAvatar(bodyResponse);
    }

    @UsePipes(new ZodValidationPipe(ForgotPasswordDTO))
    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body() bodyResponse: ForgotPasswordDTO) {
        return this.userService.forgotPassword(bodyResponse);
    }

    @Patch("reset-password")
    @HttpCode(HttpStatus.OK)
    resetPassword(@Body() bodyResponse: ResetPasswordDTO) {
        return this.userService.resetPassword(bodyResponse);
    }

    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new ZodValidationPipe(DeleteAccountDTO))
    @Delete("delete-account")
    deleteAccount(
        @Body() bodyResponse: DeleteAccountDTO,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.userService.deleteAccount(bodyResponse, res);
    }
}
