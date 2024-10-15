import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AccessTokenInterface } from '../interfaces/tokens.interface';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<UserInterface> {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<AccessTokenInterface> {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@User() user: UserInterface): Promise<UserInterface> {
        return this.authService.getMe(user.id);
    }
}
