import { User } from "./user.entity";
import { CreateUserDto } from "./dto/users.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { genSalt, hash, compare } from "bcryptjs";


@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async creatUser(dto: CreateUserDto): Promise<User> {
        const salt: string = await genSalt(10);
        const user: User = this.userRepository.create({
            username: dto.username,
            hashedPassword: await hash(dto.password, salt),
            email: dto.email,
        });
        return await this.userRepository.save(user);
    }

    async findUserById(id: string): Promise<object> {
        const user = await this.userRepository.findOne({ where: { id } });
        return { id: user.id, username: user.username, email: user.email };
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneBy({ username: username });
    }

    async getUser(username: string, password: string): Promise<User> {
        const user = await this.getUserByUsername(username);
        if (!user) {
            throw new UnauthorizedException("Not found");
        }
        const isCorrectPassword = await compare(password, user.hashedPassword);
        if (!isCorrectPassword) {
            throw new UnauthorizedException("Invalid");
        }
        return user;
    }

    async login(username: string, email: string): Promise<object> {
        const payload = { username, email };
        return { accessToken: await this.jwtService.signAsync(payload) };
    }

}
