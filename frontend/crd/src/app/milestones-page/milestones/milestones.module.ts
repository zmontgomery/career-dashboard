import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MilestonesComponent } from './milestones.component';



@NgModule({
  declarations: [
    MilestonesComponent,
  ],
  exports: [
    MilestonesComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
  ]
})
export class MilestonesModule { }
