import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { JWTStrategy } from "./strategy/jwt.strategy";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getJWTConfig } from "src/configs/jwt.config";

import { PassportModule } from "@nestjs/passport";


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJWTConfig,
        }),
        PassportModule,
        ConfigModule,
    ],
    controllers: [UserController],
    providers: [UserService, JWTStrategy],
    exports: [UserService],
})
export class UserModule { }
