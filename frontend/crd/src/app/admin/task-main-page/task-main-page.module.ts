import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskMainPageComponent } from './task-main-page.component';
import { RouterLink } from "@angular/router";
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from '@angular/material/tabs';
import { TaskEditModalModule } from '../task-edit-modal/task-edit-modal.module';

@NgModule({
  declarations: [
    TaskMainPageComponent
  ],
  imports: [
    CommonModule,
    RouterLink, 
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    TaskEditModalModule
  ]
})
export class TaskMainPageModule { }
