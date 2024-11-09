import { Body, Controller, Get, Headers, HttpStatus, Param, Patch, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { updateUserDTO } from "./dto/updateUser.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudUploadService } from "src/shared/cloudUpload.service";

@Controller('User')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly cloudUploadService: CloudUploadService
    ) { }
    checkToken(token: string, res: Response) {
        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: "Token không được cung cấp"
            });
        }
        try {
            return this.jwtService.verify(token, { secret: this.configService.get<string>('SECRET_KEY') });
        } catch (err) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: `Token không hợp lệ, ${err.name}`
            });
        }
    }
    @Get("/get-user")
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({ name: "authorization", required: false })
    async getUser(
        @Headers("authorization") authorization: string,
        @Res() res: Response
    ) {
        let token = authorization.split(' ')[1];
        const tokenDecode = this.checkToken(token, res)
        try {
            let user = await this.userService.getUser(Number(tokenDecode.data.user_id));
            return res.status(HttpStatus.OK).json({
                message: "Get thông tin user thành công!",
                data: user
            })
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
    @Get('/get-pictures/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({ name: "authorization", required: false })
    async getPictures(
        @Param('id') id: string,
        @Headers("authorization") authorization: string,
        @Res() res: Response
    ) {
        let token = authorization.split(' ')[1];
        this.checkToken(token, res)
        try {
            let picture = await this.userService.getPictures(Number(id));
            return res.status(HttpStatus.OK).json({
                message: "Get hình ảnh by User_id thành công!",
                data: picture
            })
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
    @Get('/get-pictures-save/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({ name: "authorization", required: false })
    async getPicturesSave(
        @Param('id') id: string,
        @Headers("authorization") authorization: string,
        @Res() res: Response
    ) {
        let token = authorization.split(' ')[1];
        this.checkToken(token, res)
        try {
            let picture = await this.userService.getPicturesSave(Number(id));
            return res.status(HttpStatus.OK).json({
                message: "Get hình ảnh đã lưu by user_id thành công!",
                data: picture
            })
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
    @Patch('/update-user')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiHeader({ name: "authorization", required: false })
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: updateUserDTO, required: true })
    @UseInterceptors(FileInterceptor('img'))
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: updateUserDTO,
        @Headers("authorization") authorization: string,
        @Res() res: Response
    ) {
        let token = authorization.split(' ')[1];
        const tokenDecode = this.checkToken(token, res)
        try {
            const img = await this.cloudUploadService.uploadImage(file, 'img')
            body.img = img.url
            let user = await this.userService.updateUser(Number(tokenDecode.data.user_id), body);
            return res.status(HttpStatus.OK).json({
                message: "update thông tin user thành công!",
                data: user
            })
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
}