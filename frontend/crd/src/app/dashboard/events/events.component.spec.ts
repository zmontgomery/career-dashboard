import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { MatCardModule } from "@angular/material/card";
import { CarouselModule } from '@coreui/angular';
import { Event } from "../../../domain/Event";
import { EventService } from "./event.service";
import { of } from "rxjs";
import { MockComponent, MockModule } from 'ng-mocks';
const createSpyObj= jasmine.createSpyObj;

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let eventServiceSpy = createSpyObj('EventService', ['getEvents', 'getDashboardEvents']);
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
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      //imports: [MatCardModule, MockModule(CarouselModule)],
      imports: [MatCardModule],
      providers: [{provide: EventService, useValue: eventServiceSpy}],
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
