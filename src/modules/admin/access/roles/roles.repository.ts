import { PaginationRequest } from '@libs/pagination';
import { Repository } from 'typeorm';
import { RoleEntity } from './role.entity';

export interface RolesRepository extends Repository<RoleEntity> {
  this: Repository<RoleEntity>;
  getRolesAndCount(pagination: PaginationRequest): Promise<[roleEntities: RoleEntity[], totalRoles: number]>;
}
/**
 * Get roles list
 * @param pagination {PaginationRequest}
 * @returns [roleEntities: RoleEntity[], totalRoles: number]
 */
export const customRolesRepository: Pick<RolesRepository, any> = {
  async getRolesAndCount(
    this: Repository<RoleEntity>,
    pagination: PaginationRequest,
  ): Promise<[roleEntities: RoleEntity[], totalRoles: number]> {
    const {
      skip,
      limit: take,
      order,
      params: { search },
    } = pagination;
    const query = this.createQueryBuilder('r')
      .innerJoinAndSelect('r.permissions', 'p')
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (search) {
      query.where('name ILIKE :search', { search: `%${search}%` });
    }

    return query.getManyAndCount();
  },
};
