import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Career } from 'src/careers/entities/career.entity';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsNumber()
  matricula: number;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsNumber()
  career: Career;
}
