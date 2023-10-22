import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from "@angular/material/card";
import { EventsComponent } from './events/events.component';



@NgModule({
  declarations: [
    DashboardComponent,
    EventsComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class DashboardModule { }
