import { Column, Entity } from 'typeorm';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { decrypt, encrypt } from '../../../utils/encrypt.util';

@Entity({ name: 'bank', schema: 'bank' })
export class BankEntity extends MainEntityAbstract {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  province: string;

  @Column({
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  regency: string;

  @Column({
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  district: string;

  @Column({
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  village: string;

  @Column({ type: 'text' })
  address: string;

  @Column({
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  postal_code: string;

  @Column({
    transformer: {
      to: (value: string) => encrypt(value), // Encrypt before saving
      from: (value: string) => decrypt(value), // Decrypt when retrieving
    },
  })
  phone: string;

  @Column()
  owner_id: number;
}
