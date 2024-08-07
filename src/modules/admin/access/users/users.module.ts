import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { customUsersRepository } from './users.repository';
import { UserEntity } from './user.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    {
      provide: getRepositoryToken(UserEntity),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(UserEntity).extend(customUsersRepository);
      },
    },
    UsersService,
  ],
})
export class UsersModule {}
