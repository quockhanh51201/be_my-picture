import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt'
import { ShareModule } from 'src/shared/shareModule';

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true })
    JwtModule.register({}),
    ShareModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
