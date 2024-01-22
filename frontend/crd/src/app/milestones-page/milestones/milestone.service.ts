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

  getMilestones(forceRefresh?: boolean): any {
    // return last value (i.e. cache) from ReplaySubject or add data to it
    if (!this.hasBeenRequested || forceRefresh) {
      console.log("calling refresh")
      this.hasBeenRequested = true;
      const milestoneData = this.http.get<Milestone[]>(constructBackendRequest(Endpoints.MILESTONES))
        .pipe(map((data: any) => {
          return data.map((milestoneData: MilestoneJSON) => {
            return new Milestone(milestoneData)
          })
      }));

      //makes sure the HTTP is done before adding data to cache
      const processedObservable = milestoneData.pipe(
          concatMap((processedData: any) => {
            this.milestoneCache$.next(processedData);
            return of(processedData);
          })
        );

      return processedObservable;
    }

    return this.milestoneCache$;

  }

}
