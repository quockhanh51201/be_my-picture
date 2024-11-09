import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt, IsOptional, IsString } from "class-validator";

export class CreatePictureDTO {
    @IsNotEmpty({ message: "Tên hình không được để trống" })
    @ApiProperty({ description: "Tên của hình ảnh" })
    ten_hinh: string;

    // @IsNotEmpty({ message: "Đường dẫn không được để trống" })
    @ApiProperty({ description: "Đường dẫn đến hình ảnh", format: 'binary' })
    duong_dan: string;

    @IsOptional()
    @ApiProperty({ description: "Mô tả về hình ảnh", required: false })
    mo_ta?: string;

    @IsNotEmpty({ message: "Người dùng ID không được để trống" })
    @ApiProperty({ description: "ID của người dùng liên kết với hình ảnh" })
    nguoi_dung_id: number;
}
