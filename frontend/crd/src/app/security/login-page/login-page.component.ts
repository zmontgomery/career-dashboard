import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {

  constructor(private readonly authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  ms() {
    this.authService.loginRedirectMS();
  }

  temp() {
    this.authService.navigateOffLogin();
  }
}
