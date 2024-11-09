import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, isDate, IsDate, isString } from 'class-validator';

export class CreateCommentDTO {
    @IsInt()
    @IsNotEmpty({ message: "id người dùng không được để trống" })
    @ApiProperty({ description: "ID của người dùng" })
    nguoi_dung_id: number;

    @IsInt()
    @IsNotEmpty({ message: "id ảnh không được để trống" })
    @ApiProperty({ description: "ID ảnh" })
    hinh_id: number;

    @IsString()
    @IsNotEmpty({ message: "nội dung không được để trống" })
    @ApiProperty({ description: "Nội dung comment" })
    noi_dung: string;

    @IsString()
    @ApiProperty({ description: "Ngày bình luận" })
    ngay_binh_luan: string;
}
