import {Routes} from '@angular/router';

import {AdminGuard} from './guards/admin-guard';
import {AuthGuard} from './guards/auth-guard';
import {NoAuthGuard} from './guards/no-auth-guard';
import {Animal} from './pages/animal/animal';
import {AnimalDetails} from './pages/animal/animal-details/animal-details';
import {App} from './pages/app/app';
import {AuthApp} from './pages/auth/auth-app';
import {ForgotPassword} from './pages/auth/forgot-password/forgot-password';
import {Login} from './pages/auth/login/login';
import {ResetPassword} from './pages/auth/reset-password/reset-password';
import {Signup} from './pages/auth/signup/signup';
import {Dashboard} from './pages/dashboard/dashboard';
import {Reservation} from './pages/reservation/reservation';
import {ReservationCreation} from './pages/reservation/reservation-creation/reservation-creation';
import {ReservationDetails} from './pages/reservation/reservation-details/reservation-details';
import {ServiceType} from './pages/service-type/service-type';
import {ServiceTypeDetails} from './pages/service-type/service-type-details/service-type-details';
import {UserPage} from './pages/user/user';
import {UserDetails} from './pages/user/user-details/user-details';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full"
  },
  {
    path: 'auth',
    component: AuthApp,
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'signup',
        component: Signup,
      },
      {
        path: 'forgot-password',
        component: ForgotPassword,
      },
      {
        path: 'reset-password/:id',
        component: ResetPassword,
      },

    ]
  },
  {
    path: '',
    component: App,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'user',
        canActivate: [AdminGuard],
        children: [
          {
            path: 'create',
            component: UserDetails,
          },
          {
            path: ':id',
            component: UserDetails,
          },
          {
            path: '',
            component: UserPage,
          },
        ],
      },
      {
        path: 'animal',
        children: [
          {
            path: 'create',
            component: AnimalDetails,
          },
          {
            path: ':id',
            component: AnimalDetails,
          },
          {
            path: '',
            component: Animal,
          },
        ],
      },
      {
        path: 'service-type',
        canActivate: [AdminGuard],
        children: [
          {
            path: 'create',
            component: ServiceTypeDetails,
          },
          {
            path: ':id',
            component: ServiceTypeDetails,
          },
          {
            path: '',
            component: ServiceType,
          },
        ],
      },
      {
        path: 'reservation',
        children: [
          {
            path: 'create',
            component: ReservationCreation,
          },
          {
            path: ':id',
            component: ReservationDetails,
          },
          {
            path: '',
            component: Reservation,
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            component: UserDetails,
          }
        ],
      },
    ]
  },
];
