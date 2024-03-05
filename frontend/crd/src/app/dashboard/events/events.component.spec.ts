import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { MatCardModule } from "@angular/material/card";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Event } from "../../../domain/Event";
import { EventService } from "./event.service";
import { of } from "rxjs";
import { MockModule } from 'ng-mocks';
import {ArtifactService} from "../../file-upload/artifact.service";
const createSpyObj= jasmine.createSpyObj;

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let eventServiceSpy = createSpyObj('EventService', ['getEvents', 'getDashboardEvents']);
  let artifactServiceSpy = createSpyObj('ArtifactService', ['getEvents', 'getDashboardEvents']);
  eventServiceSpy.getEvents.and.returnValue(of(Array(new Event({
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      id: 1,
      recurring: true,
      organizer: "organizer",
      location: "location",
      eventLink: "sample link",
      buttonLabel: "test",
      imageId: 1,
  }))));

  eventServiceSpy.getDashboardEvents.and.returnValue(of(Array(new Event({
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      id: 2,
      recurring: true,
      organizer: "organizer",
      location: "location",
      eventLink: "sample link",
      buttonLabel: "test",
      imageId: 1,
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      //imports: [MatCardModule, MockModule(CarouselModule)],
      imports: [MatCardModule],
      providers: [
        {provide: EventService, useValue: eventServiceSpy},
        {provide: ArtifactService, useValue: artifactServiceSpy},
      ],
      declarations: [EventsComponent]
    });
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
