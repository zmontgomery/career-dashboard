import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MilestonesComponent } from './milestones.component';
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";



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
    RouterLink,
    MatButtonModule,
  ]
})
export class MilestonesModule { }
