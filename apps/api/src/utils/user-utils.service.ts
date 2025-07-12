import {Role} from "@caniparadis/dtos/dist/userDto";

/**
 * Setting default role when no data found, else return data
 */
export function sanitizeUserRole(inputRole?: Role): Role {
  return inputRole ?? Role.USER;
}
