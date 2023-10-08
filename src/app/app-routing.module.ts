import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/dashboard/login/login.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

  const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'auth'
    },
    {
      path: 'auth',
      component: AuthLayoutComponent,
      children: [
        { path: '', pathMatch: 'full', redirectTo: 'login' },
        { path: 'login', component: LoginComponent },
      ],
    },
    {
      path: 'dashboard',
      // canActivate: [AuthGuard], 
      component: DashboardComponent 
     },
    // Add other routes or redirect to a 404 page if necessary
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
