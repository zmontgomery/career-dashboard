import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Milestone, MilestoneJSON} from "../../domain/Milestone";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {

  constructor(
    private http: HttpClient,
  ) {
  }

  // Get all data items
  getMilestones(): Observable<Milestone[]> {
    return this.http.get<Milestone[]>('http://localhost:8080/api/milestones')
      .pipe(map((data: any) => {
        return data.map((milestoneData: MilestoneJSON) => {
          return new Milestone(milestoneData)
        })
      }))
  }
}
