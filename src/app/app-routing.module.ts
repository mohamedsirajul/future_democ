import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/sessions/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { QrVerifyComponent } from './components/qr-verify/qr-verify.component';
import { OtpVerifyComponent } from './components/otp-verify/otp-verify.component';
import { FaceVerifyComponent } from './components/face-verify/face-verify.component';
import { VotingPanelComponent } from './components/voting-panel/voting-panel.component';

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
     {
      path: 'qr_verify',
      // canActivate: [AuthGuard], 
      component: QrVerifyComponent 
     },
     {
      path: 'otp_verify',
      // canActivate: [AuthGuard], 
      component: OtpVerifyComponent 
     },
     {
      path: 'face_verify',
      // canActivate: [AuthGuard], 
      component: FaceVerifyComponent 
     },
     {
      path: 'voting_panel',
      // canActivate: [AuthGuard], 
      component: VotingPanelComponent 
     },

    // Add other routes or redirect to a 404 page if necessary
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
