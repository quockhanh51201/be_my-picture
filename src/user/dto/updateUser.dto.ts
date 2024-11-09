import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class updateUserDTO {

    @ApiProperty({ description: "Họ tên của người dùng" })
    fullName: string;

    @ApiProperty({ description: "Tuổi của người dùng" })
    age: number;

    @ApiProperty({ description: "Ảnh đại diện của người dùng", type: 'string', format: 'binary' })
    img: string;

}

