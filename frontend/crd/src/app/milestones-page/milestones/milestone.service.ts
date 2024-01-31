import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Milestone, MilestoneJSON } from "../../../domain/Milestone";
import { concatMap, finalize, map, Observable, of, ReplaySubject } from "rxjs";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {

  private milestoneCache$ = new ReplaySubject<any>();
  private hasBeenRequested = false;

  constructor(
    private http: HttpClient,
  ) {
  }

  getMilestones(forceRefresh?: boolean): Observable<Milestone[]> {
    // return last value (i.e. cache) from ReplaySubject or add data to it
    if (!this.hasBeenRequested || forceRefresh) {
      this.hasBeenRequested = true;

      this.http.get<Milestone[]>(constructBackendRequest(Endpoints.MILESTONES)).subscribe((data) => {
        const mappedData = data.map((milestoneData: any) => {
            return new Milestone(milestoneData)
          })
        this.milestoneCache$.next(mappedData)
      })
    }

    return this.milestoneCache$.asObservable();

  }

}
