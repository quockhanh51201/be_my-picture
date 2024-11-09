import { PartialType } from '@nestjs/swagger';
import { CreatePictureDTO } from './create-picture.dto';

export class UpdatePictureDto extends PartialType(CreatePictureDTO) { }
