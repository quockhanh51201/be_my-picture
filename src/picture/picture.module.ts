import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ShareModule } from 'src/shared/shareModule';

@Module({
  imports: [ShareModule],
  controllers: [PictureController],
  providers: [PictureService, JwtStrategy, JwtService],
})
export class PictureModule { }
