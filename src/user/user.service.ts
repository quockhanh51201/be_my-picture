import { Injectable, NotFoundException } from "@nestjs/common";
import { userDTO } from "./dto/user.dto";
import { PrismaClient } from "@prisma/client";
import { plainToClass } from "class-transformer";
import { pictureDTO } from "src/picture/dto/picture.dto";
import { updateUserDTO } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
    prisma = new PrismaClient()
    async getUser(user_id: Number): Promise<userDTO> {
        try {
            let user = await this.prisma.nguoi_dung.findFirst({
                where: ({ nguoi_dung_id: Number(user_id) })
            })
            return plainToClass(userDTO, user)
        } catch (error) {
            throw new Error(error)
        }
    }
    async getPictures(id: number): Promise<pictureDTO[] | null> {
        try {
            let pictures = await this.prisma.hinh_anh.findMany({
                where: { nguoi_dung_id: id }
            });
            return pictures.map(picture => plainToClass(pictureDTO, picture));
        } catch (error) {
            throw new Error(error)
        }
    }
    async getPicturesSave(id: number): Promise<pictureDTO[] | null> {
        try {
            let pictures = await this.prisma.luu_anh.findMany({
                where: { nguoi_dung_id: id },
                include: {
                    hinh_anh: true
                }
            });
            return pictures.map(picture => plainToClass(pictureDTO, picture));
        } catch (error) {
            throw new Error(error)
        }
    }
    async updateUser(id: number, body: updateUserDTO): Promise<userDTO | null> {
        try {
            let user = await this.prisma.nguoi_dung.update({
                where: { nguoi_dung_id: id },
                data: {
                    ho_ten: body.fullName,
                    tuoi: Number(body.age),
                    anh_dai_dien: body.img
                }
            });
            return plainToClass(userDTO, user);
        } catch (error) {
            throw new Error(error)
        }
    }
}