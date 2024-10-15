import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './api/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-straregy';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/models/user.model';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    SequelizeModule.forFeature([User]), 
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}