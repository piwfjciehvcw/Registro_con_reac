import { Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Career } from './entities/career.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>
  ) { }
  async create(createCareerDto: CreateCareerDto) {
    const newCareer = this.careerRepository.create(createCareerDto)
    return await this.careerRepository.save(newCareer)
  }

  async findAll() {
    return await this.careerRepository.find()
  }

  async findOne(id: number) {
    return await this.careerRepository.findOne({ where: { id } })
  }

  async update(id: number, updateCareerDto: UpdateCareerDto) {
    const careerToUpdate = await this.careerRepository.findOne({ where: { id } })
    if (!careerToUpdate) {
      throw new Error(`Career with id ${id} not found`);
    }
    this.careerRepository.merge(careerToUpdate, updateCareerDto);
    return await this.careerRepository.save(careerToUpdate);
  }

  async remove(id: number) {
    const studentToRemove = await this.careerRepository.findOne({ where: { id } });
    if (!studentToRemove) {
      throw new Error(`Career with id: ${id} not found`);
    }
    return await this.careerRepository.remove(studentToRemove);
  }
}
