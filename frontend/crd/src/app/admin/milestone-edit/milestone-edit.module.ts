import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestoneEditComponent } from './milestone-edit.component';
import { MatButtonModule } from "@angular/material/button";


@NgModule({
  declarations: [
    MilestoneEditComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class MilestoneEditModule { }
