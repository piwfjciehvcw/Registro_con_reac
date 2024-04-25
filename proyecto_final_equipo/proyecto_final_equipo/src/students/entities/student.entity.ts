import { Career } from "src/careers/entities/career.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
  @PrimaryColumn()
  matricula: number

  @Column()
  nombre: string

  @Column()
  direccion: string

  @ManyToOne(() => Career)
  career: Career
}
