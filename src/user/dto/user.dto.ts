import { Exclude, Expose } from "class-transformer";

export class userDTO {
    @Expose()
    nguoi_dung_id: number

    @Expose()
    email: string

    @Exclude()
    mat_khau: string

    @Expose()
    ho_ten: string

    @Expose()
    tuoi: Number

    @Expose()
    anh_dai_dien: string


    constructor(partial: Partial<any>) {
        Object.assign(this, partial)
    }
}