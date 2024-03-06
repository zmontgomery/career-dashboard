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

  /**
   * Gets all events
   */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(constructBackendRequest(Endpoints.EVENTS))
      .pipe(map((data: any) => {
        return data.map((eventData: EventJSON) => {
          return new Event(eventData)
        })
      }))
  }

  /**
   * Gets the specific page of events to show on the dashboard
   * Currently not implemented on the backend so it acts the same as getEvents()
   */
  getDashboardEvents(pageNum: number): Observable<Event[]> {
    const pageParam = {key: 'pageNum', value: pageNum};
    return this.http.get<Event[]>(constructBackendRequest(Endpoints.DASHBOARD_EVENTS, pageParam))
      .pipe(map((data: any) => {
        return data.map((eventData: EventJSON) => {
          return new Event(eventData)
        })
      }))
  }
}
