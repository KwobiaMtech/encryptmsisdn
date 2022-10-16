import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionSource } from 'ormconfig';
import { DataSourceOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptEntity } from './entities/encrypt.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => (await connectionSource) as DataSourceOptions,
    }),
    TypeOrmModule.forFeature([EncryptEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
