import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../domain/user';
import { LangUtils } from 'src/app/util/lang-utils';
import {Router} from "@angular/router";
import {ArtifactService} from "../../file-upload/artifact.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserService} from "../user.service";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less']
})
export class UserMenuComponent implements OnInit {

  user: User = User.makeEmpty();
  profileURL: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly userService: UserService,
    ) {
    // TODO replace with userService
    this.authService.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.user = user!;
        this.userService.getProfilePicture()
          .subscribe((url) => {
            console.log(url);
            this.profileURL =url;
          });
      }
    });
  }


  ngOnInit(): void {

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
