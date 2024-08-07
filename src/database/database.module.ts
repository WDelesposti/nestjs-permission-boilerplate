import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './database.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }), // Para carregar variáveis de ambiente
    TypeOrmModule.forRoot(AppDataSource.options), // Passa a configuração para TypeOrmModule
  ],
  exports: [TypeOrmModule], // Exporta o TypeOrmModule para outros módulos que possam precisar
})
export class DatabaseModule {}
