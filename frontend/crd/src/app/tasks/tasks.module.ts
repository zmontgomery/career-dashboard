import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { MatListModule } from '@angular/material/list';



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
  ]

})
export class TasksModule { }
