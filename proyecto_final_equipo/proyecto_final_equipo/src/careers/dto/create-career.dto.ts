import { IsNotEmpty, IsString } from "class-validator";

export class CreateCareerDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
