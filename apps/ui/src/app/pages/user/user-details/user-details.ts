import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateUserDto, Role, UpdateUserDto, UserDto} from '@caniparadis/dtos/dist/userDto';
import {UserService} from '../../../services/user.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToasterService} from '../../../services/toaster.service';

@Component({
  selector: 'app-user-details',
  imports: [FormsModule,
    CommonModule,
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss'
})
export class UserDetails implements OnInit {
  user: Partial<CreateUserDto & UpdateUserDto> = {};
  formSubmitted = false;
  isEditMode = false;
  userId?: number;
  roles = Object.values(Role);
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$';
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toasterService = inject(ToasterService);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.userId = +id;
        this.loadUser(this.userId);
      }
    });
  }

  loadUser(id: number) {
    this.userService.findOne(id).subscribe({
      next: (user: UserDto) => {
        this.user = user;
        delete this.user.password;
      },
      error: () => {
        this.router.navigateByUrl('/users');
      },
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (!this.isValid()) return;

    if (this.isEditMode && this.userId) {
      const updateDto: UpdateUserDto = {...this.user};

      this.userService.update(this.userId.toString(), updateDto).subscribe(
        (user) => {
          this.toasterService.success(`L'utilisateur.trice ${user.firstName} ${user.lastName} a été modifié.e avec succès`);
          this.router.navigateByUrl('/user');
        },
        _ => this.toasterService.error("Impossible de modifier l'utilisateur.trice. Veuillez réessayer"));
    } else {
      const createDto: CreateUserDto = {...(this.user as CreateUserDto)};
      this.userService.create(createDto).subscribe(
        (user) => {
          this.toasterService.success(`L'utilisateur.trice ${user.firstName} ${user.lastName} a été créé.e avec succès`);
          this.router.navigateByUrl('/user');
        },
        _ => this.toasterService.error("Impossible de créer l'utilisateur.trice. Veuillez réessayer")
      );
    }
  }

  isValid(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    const pwdRegex = new RegExp(this.passwordPattern);

    if (!this.user.email || !emailRegex.test(this.user.email)) return false;
    if (!this.user.firstName) return false;
    if (!this.user.lastName) return false;
    if (!this.isEditMode) {
      if (!this.user.password || !pwdRegex.test(this.user.password)) return false;
    }
    return true;
  }

}
