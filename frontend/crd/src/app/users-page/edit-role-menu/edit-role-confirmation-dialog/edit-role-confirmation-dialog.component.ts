import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, User } from 'src/app/security/domain/user';
import { UserService } from 'src/app/security/user.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-edit-role-confirmation-dialog',
  templateUrl: './edit-role-confirmation-dialog.component.html',
  styleUrls: ['./edit-role-confirmation-dialog.component.less']
})
export class EditRoleConfirmationDialogComponent {

  user!: User;
  role!: Role;

  constructor(
    private readonly userService: UserService,
    private readonly matDialogRef: MatDialogRef<EditRoleConfirmationDialogComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data: {user: User, role: Role}
  ) {
    this.user = data.user;
    this.role = data.role;
  }

  onCancel() {
    setTimeout(() => this.matDialogRef.close(), 100);
  }

  onConfirm() {
    this.user.role = this.role;
    this.userService.updateRole(this.user).subscribe(() => {
      this.onCancel();
      this._snackBar.open("Role Edit Successful!", 'close', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
      });
    });
  }

  formatRole() {
    if (this.role === Role.Admin) {
      return `an ${this.role}`;
    }
    return `a ${this.role}`;
  }
}
