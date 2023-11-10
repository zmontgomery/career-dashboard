import {Component, OnInit} from '@angular/core';
import {EventService} from "./EventService";
import {Event} from "../../../domain/Event";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit{

  slides: any[] = [];
  itemsPerSlide = 2; //most likely this would be passed in the API call
  singleSlideOffset = false;
  noWrap = false;
  eventPage: number = 0;

  constructor(
    private eventService: EventService,
  ) {
  }

  ngOnInit() {
    //const isMobile = navigator.userAgent; //only display one event per page on mobile

    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;

      this.slides = new Array(events.length).fill({id: -1, name: '', date: '', img: ''});
      this.slides.forEach((slide, index) => {
        this.slides[index] = {
          id: events[index].eventID,
          name: events[index].name,
          date: events[index].date,
          description: events[index].description,
          img: '/assets/images/Oswego_logo_horizontal_black.png'  //placeholder
        };
      });
    });
  }

  events: Array<Event> = []

}
