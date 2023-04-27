import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(3)
    username: string

    @IsNotEmpty()
    @MinLength(6)
    password: string

    @IsNotEmpty()
    @IsEmail()
    email: string
}

export class LoginUserDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}