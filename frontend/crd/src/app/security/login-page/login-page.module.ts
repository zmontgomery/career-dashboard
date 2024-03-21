import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { OswegoLogoModule } from 'src/app/oswego-logo/oswego-logo.module';



@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    GoogleSigninButtonModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    OswegoLogoModule
  ],
  exports: [LoginPageComponent]
})
export class LoginPageModule { }
