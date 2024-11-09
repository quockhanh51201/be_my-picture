import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePictureDTO } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { PrismaClient } from '@prisma/client';
import { pictureDTO } from './dto/picture.dto';
import { plainToClass } from 'class-transformer';
import { contains } from 'class-validator';

@Injectable()
export class PictureService {
  prisma = new PrismaClient()
  async create(
    createPictureDto: CreatePictureDTO,
  ): Promise<pictureDTO> {
    try {
      let newPicture = await this.prisma.hinh_anh.create({
        data: {
          ten_hinh: createPictureDto.ten_hinh,
          mo_ta: createPictureDto.mo_ta,
          nguoi_dung_id: Number(createPictureDto.nguoi_dung_id),
          duong_dan: createPictureDto.duong_dan,
        }
      })
      return plainToClass(pictureDTO, newPicture)
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(
    page: number, size: number, keyword: string
  ): Promise<pictureDTO[]> {
    try {
      let pictures = await this.prisma.hinh_anh.findMany({
        where: keyword
          ? {
            ten_hinh: {
              contains: keyword
            }
          }
          : {},
        skip: (page - 1) * size,
        take: size
      })
      return pictures.map(picture => plainToClass(pictureDTO, picture))
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(id: number): Promise<pictureDTO | null> {
    try {
      const picture = await this.prisma.hinh_anh.findFirst({
        where: { hinh_id: id },
        include: {
          nguoi_dung: true
        }
      });

      if (!picture) {
        throw new NotFoundException(`Picture with ID ${id} not found`);
      }
      return plainToClass(pictureDTO, picture);
    } catch (error) {
      throw new Error(error)
    }
  }

  async getCommentByIdPicture(id: number): Promise<pictureDTO | null> {
    try {
      const picture = await this.prisma.hinh_anh.findFirst({
        where: { hinh_id: id },
        include: {
          binh_luan: true
        }
      });

      if (!picture) {
        throw new NotFoundException(`Picture with ID ${id} not found`);
      }
      return plainToClass(pictureDTO, picture);
    } catch (error) {
      throw new Error(error)
    }
  }
  async isPictureSavedByUser(userId: number, pictureId: number): Promise<boolean> {
    const savedPicture = await this.prisma.luu_anh.findFirst({
      where: {
        nguoi_dung_id: Number(userId),
        hinh_id: Number(pictureId),
      },
    });
    return savedPicture !== null;
  }

  async remove(id: number): Promise<string> {
    try {
      const picture = await this.prisma.hinh_anh.delete({
        where: { hinh_id: id }
      });
      return "Xóa thành công"
    } catch (error) {
      throw new Error(error)
    }
  }
}
