import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Milestone, MilestoneJSON} from "../../../domain/Milestone";
import {map, Observable} from "rxjs";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

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
    return this.http.get<Milestone[]>(constructBackendRequest(Endpoints.MILESTONES))
      .pipe(map((data: any) => {
        return data.map((milestoneData: MilestoneJSON) => {
          return new Milestone(milestoneData)
        })
      }))
  }
}
