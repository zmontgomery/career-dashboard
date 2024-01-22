import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestoneEditComponent } from './milestone-edit.component';
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    MilestoneEditComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class MilestoneEditModule { }
