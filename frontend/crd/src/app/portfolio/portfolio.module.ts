import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import {MilestonesComponent} from "./milestones/milestones.component";
import {PortfolioComponent} from "./portfolio.component";



@NgModule({
  declarations: [
    PortfolioComponent,
    MilestonesComponent,
  ],
  exports: [
    MilestonesComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class PortfolioModule { }
