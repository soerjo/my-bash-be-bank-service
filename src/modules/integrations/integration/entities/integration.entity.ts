import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'failed-transaction', schema: 'bank' })
export class failedIntegrationEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    account_number: string;

    @Column({ nullable: true })
    fullname: string;

    @Column({ nullable: true })
    balance: string;

    @Column({ type: 'jsonb', nullable: true })
    profile: Record<string, any>; // or just `any`, or define a custom interface

    @Column({ nullable: true })
    error_message: string; // or just `any`, or define a custom interface

    @Column({ type: 'jsonb', nullable: true })
    error: Record<string, any>; // or just `any`, or define a custom interface

    @CreateDateColumn()
    created_at: Date;

}