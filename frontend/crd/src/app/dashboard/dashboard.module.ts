import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from "@angular/material/card";
import { EventsComponent } from './events/events.component';
import { MilestonesModule } from "../milestones-page/milestones/milestones.module";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OswegoLogoModule } from "../oswego-logo/oswego-logo.module";


@NgModule({
  declarations: [
    DashboardComponent,
    EventsComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MilestonesModule,
    CarouselModule,
    OswegoLogoModule
  ]
})
export class DashboardModule { }
