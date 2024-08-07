import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '../modules/admin/access/users/user.entity';
import { RoleEntity } from '../modules/admin/access/roles/role.entity';
import { PermissionEntity } from '../modules/admin/access/permissions/permission.entity';
dotenv.config();

// TODO: Refactor this to use ConfigService

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_NAME,
  entities: [UserEntity, RoleEntity, PermissionEntity],
  synchronize: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});
