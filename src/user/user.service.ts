import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash, compare } from "bcryptjs";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { };

    async creatUser(dto: CreateUserDto) {
        const salt = await genSalt(10);
        const user = this.userRepository.create({
            username: dto.username,
            hashedPassword: await hash(dto.password, salt),
            email: dto.email
        });
        return await this.userRepository.save(user);
    }

    async findUserById(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        return { id: user.id, username: user.username, email: user.email };
    }

    async getAllUsers() {
        return await this.userRepository.find();
    }

    async getUserByUsername(username: string) {
        return await this.userRepository.findOneBy({ username: username });
    }

    async getUser(username: string, password: string) {
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

    async login(username: string, email: string) {
        const payload = { username, email };
        return {
            accessToken: await this.jwtService.signAsync(payload)
        };
    }

}
