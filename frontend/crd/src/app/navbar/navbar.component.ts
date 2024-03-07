import { Component } from '@angular/core';
import {AuthService} from "../security/auth.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {User} from "../security/domain/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  constructor(
    private readonly authService: AuthService
  ) {
    authService.user$.pipe(takeUntilDestroyed()).subscribe((user: User | null) => {
      if (user?.hasAdminPrivileges()) {
        this.navLinks = this.adminLinks;  // includes all faculty links
      }
      else if (user?.hasFacultyPrivileges()) {
        this.navLinks = this.facultyLinks;
      }
      else {
        this.navLinks = this.studentLinks
      }
    })
  }


  navLinks: Array<{path: string, label: string}> = [];

  studentLinks = [
    { path: "/dashboard", label: "Dashboard"},
    { path: "/portfolio", label: "Portfolio"},
    { path: "/profile", label: "Profile"},
    { path: "/milestones", label: "Milestones"}
  ];

  facultyLinks = [
    { path: "/faculty/users", label: "Users"},
  ];

  adminLinks = [...this.facultyLinks,
    { path: "/admin/milestones", label: "Milestones"},
    { path: "/admin/tasks", label: "Tasks"},
    { path: "/admin/events", label: "Events"},
  ]

}
