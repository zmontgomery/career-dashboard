import { Component, OnInit } from '@angular/core';
import { EventService } from "./EventService";
import { Event } from "../../../domain/Event";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit{

  itemsPerSlide = 2; //most likely this would be passed in the API call
  slides: any[] = new Array(1).fill({id: -1, name: '', date: '', img: ''});
  singleSlideOffset = false;
  noWrap = false;
  eventPage: number = 0;

  constructor(
    private eventService: EventService,
    //private readonly socialAuthService: SocialAuthService
  ) {
  }

  ngOnInit() {
    //const isMobile = navigator.userAgent; //only display one event per page on mobile
    //placeholder studentID
    this.eventService.getDashboardEvents("student", 1).subscribe((events: Event[]) => {
      this.events = events;
      console.log("events")
      console.log(events);
      console.log(this.slides);

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

      console.log("slides after");
      console.log(this.slides);
    });


    //this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID)

    //this.eventService.getGoogleEvents(1).subscribe((events: Event[]) => {});
  }

  events: Array<Event> = []

}
