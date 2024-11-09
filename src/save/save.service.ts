import { Injectable } from '@nestjs/common';
import { CreateSaveDto } from './dto/create-save.dto';
import { UpdateSaveDto } from './dto/update-save.dto';

@Injectable()
export class SaveService {
  create(createSaveDto: CreateSaveDto) {
    return 'This action adds a new save';
  }

  findAll() {
    return `This action returns all save`;
  }

  findOne(id: number) {
    return `This action returns a #${id} save`;
  }

  update(id: number, updateSaveDto: UpdateSaveDto) {
    return `This action updates a #${id} save`;
  }

  remove(id: number) {
    return `This action removes a #${id} save`;
  }
}
