import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
  scrypt,
} from 'crypto';
import { promisify } from 'util';
import { EncryptEntity } from './entities/encrypt.entity';
import { EntityManager } from 'typeorm';

type EncryptedData = {
  iv: Buffer;
  encryptedText: string;
  key: Buffer;
  msisdn: string;
};

@Injectable()
export class AppService {
  constructor(private em: EntityManager) {}

  async encrypt(msisdn: string): Promise<any> {
    const iv = randomBytes(16);
    const password = randomUUID();
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encrypted = Buffer.concat([cipher.update(msisdn), cipher.final()]);
    const encryptedText = encrypted.toString('hex');

    await this.saveEncryption({
      iv,
      encryptedText,
      key,
      msisdn,
    });
    await this.decrypt(encryptedText);
    return encryptedText;
  }

  async decrypt(text: string): Promise<any> {
    const encrypt = await this.em.findOne(EncryptEntity, {
      where: { encryptedText: text },
    });
    if (!encrypt) {
      return new HttpException('missing_msisdn', HttpStatus.BAD_REQUEST);
    }
    const key = this.stringToBuffer(encrypt.key);
    const iv = this.stringToBuffer(encrypt.iv);
    const encryptedText = this.stringToBuffer(text);
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    const decryptedText = decrypted.toString();
    return decryptedText;
  }

  async saveEncryption(encryptedData: EncryptedData): Promise<EncryptEntity> {
    const encrypt = new EncryptEntity();
    encrypt.msisdn = encryptedData.msisdn;
    encrypt.key = this.bufferToString(encryptedData.key);
    encrypt.iv = this.bufferToString(encryptedData.iv);
    encrypt.encryptedText = encryptedData.encryptedText;
    return await this.em.save(encrypt);
  }

  bufferToString(buffer: Buffer): string {
    return buffer.toString('hex');
  }

  stringToBuffer(string: string): Buffer {
    return Buffer.from(string, 'hex');
  }
}
