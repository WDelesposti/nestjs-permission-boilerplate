import { customUsersRepository, UsersRepository } from '../admin/access/users/users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard, PermissionsGuard } from './guards';
import { TokenService, AuthService } from './services';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UsersModule } from '@modules/admin/access/users/users.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('TOKEN_SECRET'),
        signOptions: {
          expiresIn: config.get('ACCESS_TOKEN_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    TokenService,
    {
      provide: getRepositoryToken(UserEntity),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(UserEntity).extend(customUsersRepository);
      },
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [JwtStrategy, PassportModule, TokenService, AuthService],
})
export class AuthModule {}
