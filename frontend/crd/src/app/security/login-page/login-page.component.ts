import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent {

  smallButton!: boolean;

  constructor(private readonly authService: AuthService) {
    this.smallButton = window.outerWidth <= 480;
  }

  ms() {
    this.authService.loginRedirectMS();
  }
}
