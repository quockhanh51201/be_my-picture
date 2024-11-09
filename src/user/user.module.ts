import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { ShareModule } from 'src/shared/shareModule';

@Module({
    imports: [ShareModule],
    controllers: [UserController],
    providers: [UserService, JwtStrategy, JwtService],
})
export class UserModule { }
