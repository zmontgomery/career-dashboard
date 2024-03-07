import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoleConfirmationDialogComponent } from './edit-role-confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    EditRoleConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    EditRoleConfirmationDialogComponent
  ]
})
export class EditRoleConfirmationDialogModule { }
