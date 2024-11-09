import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, HttpStatus, Query, Headers, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PictureService } from './picture.service';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { CreatePictureDTO } from './dto/create-picture.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { pictureDTO } from './dto/picture.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudUploadService } from 'src/shared/cloudUpload.service';

@Controller('picture')
export class PictureController {
  constructor(
    private readonly pictureService: PictureService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cloudUploadService: CloudUploadService,

  ) { }

  checkToken(token: string, res: Response) {
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Token không được cung cấp"
      });
    }
    try {
      let nguoi_dung_id = this.jwtService.verify(token, { secret: this.configService.get<string>('SECRET_KEY') });
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: `Token không hợp lệ, ${err.name}`
      });
    }
  }

  @Post("/create-picture")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreatePictureDTO, required: true })
  @UseInterceptors(FileInterceptor('duong_dan'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreatePictureDTO,
    @Res() res: Response
  ): Promise<Response<pictureDTO>> {
    const img = await this.cloudUploadService.uploadImage(file, 'img')
    body.duong_dan = img.url;
    let newPicture = await this.pictureService.create(body)
    return res.status(HttpStatus.OK).json({
      message: "Thêm hình ảnh thành công!",
      data: newPicture
    })
  }

  @Get("/get-pictures")
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "keyword", required: false, type: String })
  @ApiHeader({ name: "authorization", required: false })
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('keyword') keyword: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response<pictureDTO[]>> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      const formatPage = page ? Number(page) : 1
      const formatSize = size ? Number(size) : 10
      let pictures = await this.pictureService.findAll(formatPage, formatSize, keyword)
      return res.status(HttpStatus.OK).json({
        message: "Get danh sách hình ảnh thành công!",
        data: pictures
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get('/get-picture/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async findOne(
    @Param('id') id: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let picture = await this.pictureService.findOne(Number(id));
      return res.status(HttpStatus.OK).json({
        message: "Get hình ảnh by id thành công!",
        data: picture
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get('/get-comment-picture/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async getCommentByIdPicture(
    @Param('id') id: string,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      let comment = await this.pictureService.getCommentByIdPicture(Number(id));
      return res.status(HttpStatus.OK).json({
        message: "Get bình luận by id ảnh thành công!",
        data: comment
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }

  @Get('/is-saved')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })

  async isPictureSaved(
    @Headers("authorization") authorization: string,
    @Query('userId') userId: number,
    @Query('pictureId') pictureId: number,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      const isSaved = await this.pictureService.isPictureSavedByUser(userId, pictureId);
      return res.status(HttpStatus.OK).json({
        message: isSaved ? "Hình ảnh đã được lưu" : "Hình ảnh chưa được lưu",
        isSaved,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }

  }

  @Delete('/delete-picture/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: "authorization", required: false })
  async remove(
    @Param('id') id: Number,
    @Headers("authorization") authorization: string,
    @Res() res: Response
  ): Promise<Response> {
    let token = authorization.split(' ')[1];
    this.checkToken(token, res)
    try {
      const result = await this.pictureService.remove(Number(id));
      return res.status(HttpStatus.OK).json({
        message: result
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message
      })
    }
  }
}
