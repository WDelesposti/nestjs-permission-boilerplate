import { Module } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { customPermissionsRepository, PermissionsRepository } from './permissions.repository';
import { PermissionsService } from './permissions.service';
import { PermissionEntity } from './permission.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionsController],
  providers: [
    {
      provide: getRepositoryToken(PermissionEntity),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(PermissionEntity).extend(customPermissionsRepository);
      },
    },
    PermissionsService,
  ],
})
export class PermissionsModule {}
