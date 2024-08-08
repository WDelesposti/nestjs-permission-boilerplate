import { PaginationRequest } from '@libs/pagination';
import { Repository } from 'typeorm';
import { PermissionEntity } from './permission.entity';

export interface PermissionsRepository extends Repository<PermissionEntity> {
  this: Repository<PermissionEntity>;
  getPermissionsAndCount(
    pagination: PaginationRequest,
  ): Promise<[permissionEntities: PermissionEntity[], totalPermissions: number]>;
}
/**
 * Get permision list
 * @param pagination {PaginationRequest}
 * @returns permissionEntities[] and totalPermissions
 */
export const customPermissionsRepository: Pick<PermissionsRepository, any> = {
  async getPermissionsAndCount(
    this: Repository<PermissionEntity>,
    pagination: PaginationRequest,
  ): Promise<[permissionEntities: PermissionEntity[], totalPermissions: number]> {
    const {
      skip,
      limit: take,
      order,
      params: { search },
    } = pagination;
    const query = this.createQueryBuilder().skip(skip).take(take).orderBy(order);

    if (search) {
      query.where('description ILIKE :search', {
        search: `%${search}%`,
      });
    }

    return query.getManyAndCount();
  },
};
