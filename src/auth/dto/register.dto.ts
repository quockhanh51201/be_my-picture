import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDTO {

    @IsNotEmpty({ message: "Họ tên không được để trống" })
    @ApiProperty({ description: "Họ tên của người dùng" })
    fullName: string;

    @IsNotEmpty({ message: "Tuổi không được để trống" })
    @ApiProperty({ description: "Tuổi của người dùng" })
    age: number;

    @ApiProperty({ description: "Ảnh đại diện của người dùng", type: 'string', format: 'binary' })
    img: string;

    @IsEmail({}, { message: "Email không đúng định dạng" })
    @IsNotEmpty({ message: "Email không được để trống" })
    @ApiProperty({ description: "Địa chỉ email của người dùng" })
    email: string;

    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    @ApiProperty({ description: "Mật khẩu của người dùng" })
    password: string;
}

