import { DataSource, In } from 'typeorm';
import { UserStatus } from '../../modules/admin/access/users/user-status.enum';
import { UserEntity } from '../../modules/admin/access/users/user.entity';
import { RoleEntity } from '../../modules/admin/access/roles/role.entity';
import { PermissionEntity } from '../../modules/admin/access/permissions/permission.entity';
import { HashHelper } from '../../helpers';
import * as _ from 'lodash';

const users = [
  {
    firstName: 'Admin',
    lastName: 'Admin',
    password: 'Hello123',
    username: 'Admin',
    isSuperUser: true,
    status: UserStatus.Active,
  },
];

const rolePermissions = {
  Developer: [
    { slug: 'admin.access.users.read', description: 'Read users' },
    { slug: 'admin.access.users.create', description: 'Create users' },
    { slug: 'admin.access.users.update', description: 'Update users' },
    { slug: 'admin.access.roles.read', description: 'Read Roles' },
    { slug: 'admin.access.roles.create', description: 'Create Roles' },
    { slug: 'admin.access.roles.update', description: 'Update Roles' },
    { slug: 'admin.access.permissions.read', description: 'Read permissions' },
    {
      slug: 'admin.access.permissions.create',
      description: 'Create permissions',
    },
    {
      slug: 'admin.access.permissions.update',
      description: 'Update permissions',
    },
  ],
  Admin: [
    { slug: 'admin.access.users.read', description: 'Read users' },
    { slug: 'admin.access.users.create', description: 'Create users' },
    { slug: 'admin.access.users.update', description: 'Update users' },
    { slug: 'admin.access.roles.read', description: 'Read Roles' },
    { slug: 'admin.access.roles.create', description: 'Create Roles' },
    { slug: 'admin.access.roles.update', description: 'Update Roles' },
  ],
};

export class CreateUsersSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const roleNames = Object.keys(rolePermissions);

    // Distinct permissions contained in all roles
    const permissions = _.uniqBy(
      roleNames.reduce((acc, roleName) => {
        return acc.concat(rolePermissions[roleName]);
      }, []),
      'slug',
    );

    // Getting slugs form permissions
    const permissionSlugs = permissions.map((p) => p.slug);

    // Getting existing permissions from the DB
    const existingPermissions = await dataSource.getRepository(PermissionEntity).find({
      where: { slug: In(permissionSlugs) },
    });

    // Mapping all permissions to permission entities
    const validPermissions = permissions.map((p) => {
      const existing = existingPermissions.find((e) => e.slug === p.slug);
      if (existing) {
        return existing;
      }
      return new PermissionEntity(p);
    });

    // Creating / updating permissions
    const savedPermissions = (await dataSource.getRepository(PermissionEntity).save(validPermissions)).reduce(
      (acc, p) => {
        return { ...acc, [p.slug]: p };
      },
      {},
    );

    // Creating roles
    const roles = roleNames.map((name) => {
      const permissions = rolePermissions[name].map((p) => savedPermissions[p.slug]);
      return new RoleEntity({ name, permissions });
    });

    const savedRoles = dataSource.getRepository(RoleEntity).save(roles);

    // Creating users
    const entities = await Promise.all(
      users.map(async (u) => {
        const password = await HashHelper.encrypt(u.password);
        const user = new UserEntity({ ...u, password, roles: savedRoles });
        return user;
      }),
    );

    await dataSource.getRepository(UserEntity).save(entities);
  }
}
