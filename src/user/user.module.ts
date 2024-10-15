import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/models/user.model';
import { UserController } from './api/user.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
