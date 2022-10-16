import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract-entity.entity';

@Entity()
export class EncryptEntity extends AbstractEntity {
  @Column('text')
  key: string;

  @Column('text')
  iv: string;

  @Column('text')
  encryptedText: string;

  @Column('text')
  msisdn: string;
}
