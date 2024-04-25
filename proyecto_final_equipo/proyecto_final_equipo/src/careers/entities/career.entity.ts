import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
}
