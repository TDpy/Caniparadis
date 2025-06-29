import { Role } from '@caniparadis/dtos/dist/userDTO';

import { sanitizeUserRole } from './user-utils.service';

describe('sanitizeUserRole', () => {
  it('should return the provided role if defined', () => {
    expect(sanitizeUserRole(Role.ADMIN)).toBe(Role.ADMIN);
  });

  it('should return Role.USER if no role is provided', () => {
    expect(sanitizeUserRole()).toBe(Role.USER);
    expect(sanitizeUserRole(null)).toBe(Role.USER);
  });
});
