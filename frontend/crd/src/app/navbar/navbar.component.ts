import { Component } from '@angular/core';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  constructor(private readonly authService: AuthService) {} 

  navLinks = [
    { path: "/dashboard", label: "Dashboard"},
    { path: "/portfolio", label: "Portfolio"},
    { path: "/profile", label: "Profile"},
    { path: "/milestones", label: "Milestones"}
  ]

  logout() {
    this.authService.signOut();
  }

}
