import { Exclude, Expose } from "class-transformer";

export class pictureDTO {
    @Expose()
    hinh_id: number

    @Expose()
    ten_hinh: string

    @Expose()
    duong_dan: string

    @Expose()
    mo_ta: string

    @Exclude()
    nguoi_dung_id: string

    constructor(partial: Partial<any>) {
        Object.assign(this, partial)
    }
}