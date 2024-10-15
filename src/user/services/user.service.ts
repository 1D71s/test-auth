import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserInterface } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private userModel: typeof User
    ) { }

    async create(userData: Partial<User>): Promise<UserInterface> {
        const { email, password } = userData;

        const checkExistUser = await this.getByEmail(email);

        if (checkExistUser) {
            throw new ConflictException('User with this email exist already!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({ ...userData, password: hashedPassword });

        return this.userWithoutPassword(user);
    }
    
    async getById(id: number): Promise<UserInterface | null> {
        const user = await this.userModel.findByPk(id);
        return user ? this.userWithoutPassword(user) : null;
    }

    async getAll(): Promise<UserInterface[]> {
        const users = await this.userModel.findAll();
        return users.map(user => this.userWithoutPassword(user));
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { email }
        });
    }

    private userWithoutPassword(user: User): Omit<UserInterface, 'password'> {
        const { password, ...userWithoutPassword } = user.get({ plain: true });
        return userWithoutPassword;
    }
}
