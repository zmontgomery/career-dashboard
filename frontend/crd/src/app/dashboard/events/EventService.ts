import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Event, EventJSON} from "../../../domain/Event";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
  ) {
  }

  // Get all data items
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('http://localhost:8080/api/events')
      .pipe(map((data: any) => {
        return data.map((eventData: EventJSON) => {
          return new Event(eventData)
        })
      }))
  }

  getDashboardEvents(pageNum: number): Observable<Event[]> {
    const pageParam = {key: 'pageNum', value: pageNum};
    return this.http.get<Event[]>(constructBackendRequest(Endpoints.DASHBOARD_EVENTS, pageParam))
      .pipe(map((data: any) => {
        return data.map((eventData: EventJSON) => {
          return new Event(eventData)
        })
      }))
  }

/*   getGoogleEvents(googleID: number): Observable<Event[]> {
    return this.http.get<Event[]>('https://www.googleapis.com/calendar/v3/calendars/primary/events')
      .pipe(map((data: any) => {
        console.log("google calendar");
        console.log(data);
        return data.map((eventData: EventJSON) => {
          return new Event(eventData)
        })
      }))
  } */

  //TODO: add a get dashboard events call instead
}
