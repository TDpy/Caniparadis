import { Role } from '@caniparadis/dtos/dist/userDTO';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly userService: UserService) {}

  async run() {
    this.logger.log('Seeder - Exécution');
    const email = 'test@e2e.com';

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser == null) {
      await this.userService.create({
        email,
        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
        password: 'Test1234',
        role: Role.ADMIN,
      });
      this.logger.log('Utilisateur de test ajouté');
    }
  }
}
