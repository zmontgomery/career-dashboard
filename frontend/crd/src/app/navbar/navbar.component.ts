import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  navLinks = [
    { path: "/dashboard", label: "Dashboard"},
    { path: "/portfolio", label: "Portfolio"},
    { path: "/profile", label: "Profile"},
    { path: "/milestones", label: "Milestones"}
  ]

}
