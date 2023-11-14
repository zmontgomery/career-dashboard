import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EventService} from "./EventService";
import {of} from "rxjs";
import {Event} from "../../../domain/Event";

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // If your service makes HTTP requests
      providers: [EventService], // Include the service to be tested
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('events should return list of events', () => {
    const events = Array(new Event({
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      eventID: "id",
      isRecurring: true,
      organizer: "organizer",
      location: "location",
      isRequired: true,
    }));
    service.getEvents().subscribe(result => {
      expect(result).toEqual(events);
    });
    const request = httpMock.expectOne('http://localhost:8080/api/events');
    expect(request.request.method).toEqual('GET');
    request.flush(events)
  });

  it('dashboard_events should return list of events', () => {
    const events = Array(new Event({
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      eventID: "id",
      isRecurring: true,
      organizer: "organizer",
      location: "location",
      isRequired: true,
    }));
    service.getDashboardEvents(1).subscribe(result => {
      expect(result).toEqual(events);
    });
    const request = httpMock.expectOne('http://localhost:8080/api/dashboard_events?pageNum=1');
    expect(request.request.method).toEqual('GET');
    request.flush(events)
  });


})
