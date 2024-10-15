import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { UserInterface } from '../interfaces/user.interface';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    @Get('get-user/:id')
    async getUserById(@Param('id') id: number): Promise<UserInterface> {
        const user = await this.userService.getById(id);

        if (!user) {
            throw new NotFoundException("User is not found!")
        }

        return user;
    }

    //Тут бы я добвил проверку на админа, поскольку создание пользователя в auth/register, думаю это штучное создание в основном это делают админы
    @Post("add-user")
    async addUser(@Body() dto: RegisterDto) {
        return this.userService.create(dto);
    }
}
