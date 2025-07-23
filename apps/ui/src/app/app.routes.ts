import {Routes} from '@angular/router';
import {App} from './pages/app/app';
import {Dashboard} from './pages/dashboard/dashboard';
import {AuthGuard} from './guards/auth-guard';
import {Login} from './pages/auth/login/login';
import {Signup} from './pages/auth/signup/signup';
import {ForgotPassword} from './pages/auth/forgot-password/forgot-password';
import {ResetPassword} from './pages/auth/reset-password/reset-password';
import {NoAuthGuard} from './guards/no-auth-guard';
import {AuthApp} from './pages/auth/auth-app';

export const routes: Routes = [

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
        component: Dashboard,
      },
      {
        path: 'animal',
        component: AnimalsPage,
      },
      {
        path: 'booking',
        component: Dashboard,
      }
    ]
  },
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full"
  }
];
