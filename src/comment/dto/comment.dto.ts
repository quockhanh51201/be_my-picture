import { Exclude, Expose } from "class-transformer";

export class commentDTO {
    @Expose()
    binh_luan_id: number

    @Expose()
    ngay_binh_luan: Date

    @Expose()
    noi_dung: string

    @Exclude()
    hinh_id: string

    @Exclude()
    nguoi_dung_id: string

    constructor(partial: Partial<any>) {
        Object.assign(this, partial)
    }
}