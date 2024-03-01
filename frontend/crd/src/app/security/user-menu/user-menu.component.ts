import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../domain/user';
import { LangUtils } from 'src/app/util/lang-utils';
import {Router} from "@angular/router";
import {Endpoints} from "../../util/http-helper";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less']
})
export class UserMenuComponent implements OnInit {

  user: User = User.makeEmpty();
  profileURL: string = Endpoints.USERS_PROFILE_PICTURE;

  constructor(
    private readonly authService: AuthService,
    private readonly  router: Router,
    ) { }

  ngOnInit(): void {
      this.authService.user$.subscribe((user) => {
        if (LangUtils.exists(user)) {
          this.user = user!;
        }
      });
  }

  logout() {
    this.authService.signOut();
  }

  openSettings() {
    this.router.navigate(['/settings'])
      .then(success => {
        if (!success) {
          console.error('Navigation to settings failed')
        }
      });
  }
}
