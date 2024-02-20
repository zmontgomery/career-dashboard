import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { UsersPageComponent } from './users-page.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
  declarations: [
    UsersPageComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    NgOptimizedImage,
    RouterLink,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class UsersPageModule { }
