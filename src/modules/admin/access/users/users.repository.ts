import { PaginationRequest } from '@libs/pagination';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

export interface UsersRepository extends Repository<UserEntity> {
  this: Repository<UserEntity>;
  getUsersAndCount(pagination: PaginationRequest): Promise<[userEntities: UserEntity[], totalUsers: number]>;
  findUserByUsername(username: string): Promise<UserEntity>;
}

export const customUsersRepository: Pick<UsersRepository, any> = {
  async getUsersAndCount(
    this: Repository<UserEntity>,
    pagination: PaginationRequest,
  ): Promise<[userEntities: UserEntity[], totalUsers: number]> {
    const {
      skip,
      limit: take,
      order,
      params: { search },
    } = pagination;

    const query = this.createQueryBuilder('u')
      .innerJoinAndSelect('u.roles', 'r')
      .leftJoinAndSelect('u.permissions', 'p')
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (search) {
      query.where(
        `
            u.username ILIKE :search
            OR u.first_name ILIKE :search
            OR u.last_name ILIKE :search
            `,
        { search: `%${search}%` },
      );
    }

    return query.getManyAndCount();
  },

  async findUserByUsername(this: Repository<UserEntity>, username: string): Promise<UserEntity> {
    return this.createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'r', 'r.active = true')
      .leftJoinAndSelect('r.permissions', 'rp', 'rp.active = true')
      .leftJoinAndSelect('u.permissions', 'p', 'p.active = true')
      .where('u.username = :username', { username })
      .getOne();
  },
};

/* @Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
    
  } */
/**
   * Get users list
   * @param pagination {PaginationRequest}
   * @returns [userEntities: UserEntity[], totalUsers: number]
  
  public async getUsersAndCount(
    pagination: PaginationRequest,
  ): Promise<[userEntities: UserEntity[], totalUsers: number]> {
    const {
      skip,
      limit: take,
      order,
      params: { search },
    } = pagination;

    const query = this.createQueryBuilder('u')
      .innerJoinAndSelect('u.roles', 'r')
      .leftJoinAndSelect('u.permissions', 'p')
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (search) {
      query.where(
        `
            u.username ILIKE :search
            OR u.first_name ILIKE :search
            OR u.last_name ILIKE :search
            `,
        { search: `%${search}%` },
      );
    }

    return query.getManyAndCount();
  } */

/**
 * find user by username
 * @param username {string}
 * @returns Promise<UserEntity>
 */
/* async findUserByUsername(username: string): Promise<UserEntity> {
    return this.createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'r', 'r.active = true')
      .leftJoinAndSelect('r.permissions', 'rp', 'rp.active = true')
      .leftJoinAndSelect('u.permissions', 'p', 'p.active = true')
      .where('u.username = :username', { username })
      .getOne();
  } 
}*/
