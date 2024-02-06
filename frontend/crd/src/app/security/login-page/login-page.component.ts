import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {

  smallButton!: boolean;

  constructor(private readonly authService: AuthService, private router: Router) {
    this.smallButton = window.outerWidth <= 480;
  }

  ngOnInit(): void {
  }

  ms() {
    this.authService.loginRedirectMS();
  }

  temp() {
    this.authService.navigateOffLogin();
  }
}
