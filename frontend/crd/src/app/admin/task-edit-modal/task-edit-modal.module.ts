import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskEditModalComponent } from './task-edit-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, FloatLabelType } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    TaskEditModalComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule
  ]
})
export class TaskEditModalModule { }
