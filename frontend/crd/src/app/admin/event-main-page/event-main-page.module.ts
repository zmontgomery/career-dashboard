import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMainPageComponent } from './event-main-page.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from "@angular/material/button";


@NgModule({
  declarations: [
    EventMainPageComponent
  ],
  imports: [
    CommonModule, MatListModule, MatButtonModule
  ]
})
export class EventMainPageModule { }
