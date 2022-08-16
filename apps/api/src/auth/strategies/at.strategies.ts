import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("ACCESS_TOKEN_SECRET")
        });
    }

    async validate(payload: { id: number; email: string }) {
        if (!payload)
            throw new HttpException("Access Denied", HttpStatus.FORBIDDEN);

        return payload.id;
    }
}
