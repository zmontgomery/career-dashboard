import { Component, OnInit } from '@angular/core';
import { EventService } from "./event.service";
import { Event } from "../../../domain/Event";
import {ArtifactService} from "../../file-upload/artifact.service";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit{

  itemsPerSlide = 2; //animation only appears when there is 1 item
  slides: any[] = [];
  singleSlideOffset = false;
  noWrap = false;
  eventPage: number = 0;
  defaultLogoURL = '/assets/images/Oswego_logo_horizontal_black.png';

  constructor(
    private eventService: EventService,
    private artifactService: ArtifactService,
    //private readonly socialAuthService: SocialAuthService
  ) {
  }

  ngOnInit() {
    //const isMobile = navigator.userAgent; //only display one event per page on mobile
    // start with only the first page of events
    // TODO fire every tie carosel gets close to the end to get next page once backend is implement for this
    this.eventService.getDashboardEvents(1).subscribe((events: Event[]) => {
      this.events = events;

      this.slides = events.map((event: Event) => {
        let imgUrl = this.defaultLogoURL;  //placeholder
        if ( event.imageId != null ) {
          imgUrl = this.artifactService.getEventImageUrl(event.imageId)
        }
        return {
          id: event.eventID,
          name: event.name,
          date: event.date.toLocaleString('en-us', {month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'}),
          description: event.description,
          img: imgUrl,
          eventLink: event.eventLink
        }
      })
    });
  }

  goToLink(link: string) {
    location.href = link;
  }

  events: Array<Event> = []

}
