import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
    ParseUUIDPipe,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/users.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { };

    @Post("register")
    @HttpCode(201)
    @UsePipes(ValidationPipe)
    async createUser(@Body() dto: CreateUserDto) {
        const user = await this.userService.creatUser(dto);
        return { id: user.id, username: user.username, email: user.email }

    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() { username, password }: LoginUserDto) {
        const user = await this.userService.getUser(username, password);
        return await this.userService.login(username, password);
    }

    @Get()
    @HttpCode(200)
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async getUserByID(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.userService.findUserById(id);
    }




}
