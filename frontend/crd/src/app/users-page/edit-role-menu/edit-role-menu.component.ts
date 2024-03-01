import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';

@Component({
  selector: 'app-edit-role-menu',
  templateUrl: './edit-role-menu.component.html',
  styleUrls: ['./edit-role-menu.component.less']
})
export class EditRoleMenuComponent {

  user$: Observable<User | null>;

  constructor(private readonly authService: AuthService) {
    this.user$ = authService.user$;
  }


}
