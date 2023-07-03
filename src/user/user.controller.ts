import { UserService } from "./user.service";
import { CreateUserDto, LoginUserDto } from "./dto/users.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { User } from "./user.entity";
import * as common from "@nestjs/common";


@common.Controller("user")
export class UserController {

    constructor(private readonly userService: UserService) { }

    @common.Post("register")
    @common.HttpCode(201)
    @common.UsePipes(common.ValidationPipe)
    async createUser(@common.Body() dto: CreateUserDto): Promise<object> {
        const user: User = await this.userService.creatUser(dto);
        return { id: user.id, username: user.username, email: user.email };

    }

    @common.UsePipes(new common.ValidationPipe())
    @common.HttpCode(200)
    @common.Post("login")
    async login(@common.Body() { username, password }: LoginUserDto): Promise<object> {
        return await this.userService.login(username, password);
    }

    @common.Get()
    @common.HttpCode(200)
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @common.Get(":id")
    @common.UseGuards(JwtAuthGuard)
    @common.HttpCode(200)
    async getUserByID(@common.Param("id", new common.ParseUUIDPipe()) id: string): Promise<object> {
        return this.userService.findUserById(id);
    }


}
