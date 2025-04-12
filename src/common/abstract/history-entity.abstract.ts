import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class HistoryEntityAbstract extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Exclude()
  @Column({ nullable: false, default: 0 })
  created_by: number;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @Column({ nullable: false, default: 0 })
  updated_by: number;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
