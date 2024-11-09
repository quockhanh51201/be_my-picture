import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PictureModule } from './picture/picture.module';
import { CommentModule } from './comment/comment.module';
import { SaveModule } from './save/save.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, PictureModule, CommentModule, SaveModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
