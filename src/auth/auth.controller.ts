import { Controller, Post, Body, Res, HttpStatus, Patch, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';
import { RegisterDTO } from './dto/register.dto';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Auth')
@Controller('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudUploadService: CloudUploadService
  ) { }

  @Post("/register")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: RegisterDTO, required: true })
  @UseInterceptors(FileInterceptor('img'))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: RegisterDTO,
    @Res() res: Response
  ): Promise<Response<String>> {
    try {
      const img = await this.cloudUploadService.uploadImage(file, 'img')
      body.img = img.url
      const result = await this.authService.register(body)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }

  @Post("/login")
  async login(
    @Body() body: LoginDTO,
    @Res() res: Response
  ): Promise<Response<String>> {
    try {
      const result = await this.authService.login(body)
      return res.status(HttpStatus.OK).json({
        message: "Đăng nhập thành công!",
        token: result
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message })
    }
  }
}
