import { decrypt, encrypt, staticDecrypt, staticEncrypt } from '../../../utils/encrypt.util';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity } from 'typeorm';
import Decimal from 'decimal.js';

@Entity({ name: 'customer', schema: 'bank' })
export class CustomerEntity extends MainEntityAbstract {
  @Column({ unique: true, nullable: true })
  last_transaction_id: string; // just success transaction id

  @Column({
      default: 0, 
      type: 'decimal',
      precision: 18,
      scale: 4,
      transformer: {
        to: (value: Decimal | string | number): string => {
          return new Decimal(value ?? 0).toFixed(4, Decimal.ROUND_HALF_UP);
        },
        from: (value: string): Decimal => {
          return new Decimal(value ?? 0);
        },
      },
  })
  balance: Decimal;

  @Column({
    nullable: true,
  })
  user_id: number;

  @Column({
    nullable: true,
  })
  bank_id: number;

  @Column({ unique: true, })
  private_account_number: string;

  @Column({ unique: true, })
  public_account_number: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  temp_password: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => staticEncrypt(value), // Encrypt before saving
      from: (value: string) => staticDecrypt(value), // Decrypt when retrieving
    },
  })
  full_name: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => staticEncrypt(value), // Encrypt before saving
      from: (value: string) => staticDecrypt(value), // Decrypt when retrieving
    },
  })
  name: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => staticEncrypt(value), // Encrypt before saving
      from: (value: string) => staticDecrypt(value), // Decrypt when retrieving
    },
  })
  identity_number: string;

  @Column({
    nullable: true,
  })
  photo_url: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  province: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  regency: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  district: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  village: string;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  address: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  postal_code: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  phone: string;

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  email: string;
}
