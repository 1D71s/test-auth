import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { AccessTokenInterface } from '../interfaces/tokens.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto): Promise<UserInterface> {
        return this.userService.create(dto);
    }
    
    async validateUserById(userId: number): Promise<UserInterface> {
        const user = await this.userService.getById(userId); 
        
        if (!user) {
          throw new NotFoundException('User was not found!')
        }
        return user; 
    }

    async login(dto: LoginDto): Promise<AccessTokenInterface> {
        const { password, email } = dto;
        const user = await this.userService.getByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const payload = { email: user.email, id: user.id};
            const accessToken = this.jwtService.sign(payload);
            return { accessToken };
        }
        throw new UnauthorizedException('Invalid email or password');
    }

    async getMe(id: number): Promise<UserInterface> {
        return this.userService.getById(id)
    }
}
