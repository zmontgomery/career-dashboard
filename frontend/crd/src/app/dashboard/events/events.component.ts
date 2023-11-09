import {Component, OnInit} from '@angular/core';
import {EventService} from "./EventService";
import {Event} from "../../../domain/Event";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit{

  constructor(
    private eventService: EventService,
  ) {
  }

  ngOnInit() {
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
    });
  }

  events: Array<Event> = []

}
