import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMainPageComponent } from './event-main-page.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from "@angular/material/button";
import { EventEditModalModule } from '../event-edit-modal/event-edit-modal.module';
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    EventMainPageComponent
  ],
    imports: [
        CommonModule,
        MatListModule,
        MatButtonModule,
        EventEditModalModule,
        MatIconModule
    ]
})
export class EventMainPageModule { }
