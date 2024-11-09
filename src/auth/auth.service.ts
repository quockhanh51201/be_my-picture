import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  prisma = new PrismaClient()
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }


  async login(body: LoginDTO): Promise<string> {
    try {
      const { email, password } = body
      const checkUser = await this.prisma.nguoi_dung.findFirst({
        where: { email }
      })
      if (!checkUser) {
        throw new BadRequestException("Email is wrong")
      }
      const checkPass = bcrypt.compareSync(password, checkUser.mat_khau)
      if (!checkPass) {
        throw new BadRequestException("Password is wrong")
      }
      const token = this.jwtService.sign(
        { data: { user_id: checkUser.nguoi_dung_id } },
        {
          expiresIn: "30m",
          algorithm: 'HS256',
          privateKey: this.configService.get<string>('SECRET_KEY')
        }
      )
      return token
    } catch (error) {
      throw new Error(error)
    }
  }

  async register(body: RegisterDTO): Promise<string> {
    try {
      const { fullName, age, email, password, img } = body
      const userExist = await this.prisma.nguoi_dung.findFirst({
        where: { email }
      })
      if (userExist) {
        return "Tài khoản đã tồn tại"
      }
      let userNew = await this.prisma.nguoi_dung.create({
        data: {
          ho_ten: fullName,
          email: email,
          mat_khau: bcrypt.hashSync(password, 10),
          tuoi: Number(age),
          anh_dai_dien: img
        }
      })
      return "Đăng kí tài khoản thành công !"
    } catch (error) {
      throw new Error(error)
    }
  }
  async updateAvt(id: number, img: string) {
    try {
      const updatedUser = await this.prisma.nguoi_dung.update({
        where: { nguoi_dung_id: id },
        data: { anh_dai_dien: img },
      });
      return "Cập nhật ảnh đại diện thành công !"
    } catch (error) {
      throw new Error(error)
    }
  }
}
