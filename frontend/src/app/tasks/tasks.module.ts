import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    TasksComponent,
  ],
  exports: [
  TasksComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
  ]

})
export class TasksModule { }
