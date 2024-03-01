import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../domain/user';
import { LangUtils } from 'src/app/util/lang-utils';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less']
})
export class UserMenuComponent implements OnInit {

  user: User = User.makeEmpty();

  constructor(private readonly authService: AuthService) { }

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
    // this.router
    console.log('open settings')
  }
}
