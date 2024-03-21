import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { UserMenuComponent } from './user-menu.component';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [
    UserMenuComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgOptimizedImage
  ],
  exports: [UserMenuComponent]
})
export class UserMenuModule { }
