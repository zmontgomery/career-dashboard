import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { UsersPageComponent } from './users-page.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    UsersPageComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    NgOptimizedImage,
  ],
})
export class UsersPageModule { }
