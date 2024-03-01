import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRoleMenuComponent } from './edit-role-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    EditRoleMenuComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [EditRoleMenuComponent]
})
export class EditRoleMenuModule { }
