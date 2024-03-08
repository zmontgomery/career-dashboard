import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MilestoneCreateModalComponent } from './milestone-create-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { RouterLink } from "@angular/router";


@NgModule({
  declarations: [
    MilestoneCreateModalComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    RouterLink
  ]
})
export class MilestoneCreateModalModule { }
