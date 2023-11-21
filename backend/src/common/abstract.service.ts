import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';


@Injectable()
export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}

  //get all 
  async all(): Promise<any[]> {
    return await this.repository.find();
  }

  //paginate
  async paginate(page = 1): Promise<PaginatedResult> {
    const take = 15;
    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
    });

    return {
      data: data,
      meta: { total, page, last_page: Math.ceil(total / take) },
    };
  }
  

  //create
  async create(data): Promise<any> {
    return this.repository.save(data);
  }

  //findone
  async findOne(condition): Promise<any> {
    return this.repository.findOne(condition);
  }
  //update
  async update(id: number, data): Promise<any> {
    return this.repository.update(id, data);
  }
  //delete
  async delete(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
