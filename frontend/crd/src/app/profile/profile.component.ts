import { Component, OnInit } from '@angular/core';
import { LangUtils } from '../util/lang-utils';
import { User } from '../security/domain/user';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit{

  user: User = User.makeEmpty();

  constructor(
    private readonly authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.user = user!;
      }
    });
  }
}
