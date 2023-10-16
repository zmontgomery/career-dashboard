import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Event, EventJSON} from "../../domain/Event";

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
}
