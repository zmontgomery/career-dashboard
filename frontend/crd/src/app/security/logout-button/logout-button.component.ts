import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { User } from '../domain/user';
import { LangUtils } from 'src/app/util/lang-utils';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.less']
})
export class LogoutButtonComponent implements OnInit {

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
}
