import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import {PortfolioComponent} from "./portfolio.component";
import {MilestonesModule} from "../milestones-page/milestones/milestones.module";



@NgModule({
  declarations: [
    PortfolioComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MilestonesModule
  ]
})
export class PortfolioModule { }
