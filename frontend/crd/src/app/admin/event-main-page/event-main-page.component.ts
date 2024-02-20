import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/dashboard/events/event.service';
import { Event } from "../../../domain/Event";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-event-main-page',
  templateUrl: './event-main-page.component.html',
  styleUrls: ['./event-main-page.component.less']
})
export class EventMainPageComponent implements OnInit {

  events: Array<Event> = []

  constructor(
    private eventService: EventService,
  ) {
  }

  ngOnInit() {

    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
    });
  }

  openEventEditModal(event: Event | null) {
    console.log("clicked on event modal")
    console.log(event);
  }

}
