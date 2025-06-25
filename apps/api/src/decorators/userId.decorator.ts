import { SetMetadata } from '@nestjs/common';

export const CHECK_USER_PARAM_ID = 'checkUserParamId';

export const CheckUserParamId = (paramName: string) => SetMetadata(CHECK_USER_PARAM_ID, paramName);
