import { Module } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { customRolesRepository } from './roles.repository';
import { RolesService } from './roles.service';
import { RoleEntity } from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RolesController],
  providers: [
    {
      provide: getRepositoryToken(RoleEntity),
      inject: [getDataSourceToken()],
      useFactory(dataSource) {
        return dataSource.getRepository(RoleEntity).extend(customRolesRepository);
      },
    },
    RolesService,
  ],
})
export class RolesModule {}
