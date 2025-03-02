import { SetMetadata } from '@nestjs/common';
import type { USER_ROLE } from 'src/models/users';

export const ROLES_KEY = 'roles';
export const Roles = (...role: USER_ROLE[]) => SetMetadata(ROLES_KEY, role);
