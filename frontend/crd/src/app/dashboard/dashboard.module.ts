import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from "@angular/material/card";
import { EventsComponent } from './events/events.component';
import { MilestonesModule } from "../milestones-page/milestones/milestones.module";
//import { CarouselModule } from 'ngx-bootstrap/carousel';
import {MatListModule} from '@angular/material/list';



@NgModule({
  declarations: [
    DashboardComponent,
    EventsComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MilestonesModule,
    MatListModule,
    //CarouselModule
  ]
})
export class DashboardModule { }
