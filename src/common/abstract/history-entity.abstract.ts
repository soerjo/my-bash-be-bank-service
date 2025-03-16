import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class HistoryEntityAbstract extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Exclude()
  @Column({ nullable: false, default: 0 })
  created_by: number;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;
}
