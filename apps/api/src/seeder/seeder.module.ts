import { Module } from '@nestjs/common';

import {UserModule} from "../user/user.module";
import {SeederService} from "./seeder.service";

@Module({
  imports: [UserModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
