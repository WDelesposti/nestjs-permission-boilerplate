import { UserEntity } from '@modules/admin/access/users/user.entity';

export interface ValidateTokenResponseDto {
  valid: boolean;
  user?: UserEntity;
}
