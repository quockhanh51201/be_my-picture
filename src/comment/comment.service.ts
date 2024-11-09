import { Injectable } from '@nestjs/common';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { PrismaClient } from '@prisma/client';
import { commentDTO } from './dto/comment.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CommentService {
  prisma = new PrismaClient()
  async create(
    body: CreateCommentDTO
  ): Promise<commentDTO> {
    try {
      let newComment = await this.prisma.binh_luan.create({
        data: {
          nguoi_dung_id: Number(body.nguoi_dung_id),
          hinh_id: Number(body.hinh_id),
          ngay_binh_luan: new Date(body.ngay_binh_luan),
          noi_dung: body.noi_dung
        }
      })
      return plainToClass(commentDTO, newComment)
    } catch (error) {
      throw new Error(error)
    }
  }

  // findAll() {
  //   return `This action returns all comment`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} comment`;
  // }

  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} comment`;
  // }
}
