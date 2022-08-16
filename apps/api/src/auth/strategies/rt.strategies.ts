import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    const data = request?.cookies["accessToken"];

                    if (!data) {
                        return null;
                    }

                    return data;
                }
            ]),
            secretOrKey: config.get("REFRESH_TOKEN_SECRET"),
            passReqToCallback: true
        });
    }

    validate(payload) {
        if (!payload)
            throw new HttpException("Access Denied", HttpStatus.FORBIDDEN);

        return payload.cookies;
    }
}
