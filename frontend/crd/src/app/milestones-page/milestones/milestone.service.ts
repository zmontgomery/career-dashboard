import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Milestone, MilestoneJSON } from "../../../domain/Milestone";
import { catchError, concatMap, finalize, flatMap, map, mergeMap, Observable, of, ReplaySubject, tap, throwError } from "rxjs";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

/**
 * A service to retrieve milestone information from the backend
 */
@Injectable({
  providedIn: 'root'
})
export class MilestoneService {

  private readonly milestoneCache = new ReplaySubject<Milestone[]>();
  private hasBeenRequested = false;

  constructor(
    private readonly http: HttpClient,
  ) { }

  /**
   * Gets all the milestones and caches the response
   * 
   * If the cache has data in it, it returns the value of the cache, otherwise
   * it makes a request to the backend. If an error ocurrs it refreshes the cache
   */
  getMilestones(forceRefresh?: boolean): Observable<Milestone[]> {
    if (!this.hasBeenRequested || forceRefresh) {
      this.hasBeenRequested = true;

      return this.http.get<MilestoneJSON[]>(constructBackendRequest(Endpoints.MILESTONES))
        .pipe(
          catchError(() => {
            console.log('error');
            this.hasBeenRequested = false;
            return of(new Array<MilestoneJSON>());
          }),
          map((data: MilestoneJSON[]) => {
            console.log(data);
            return data.map((m: MilestoneJSON) => {
              return new Milestone(m)
            });
          }),
          mergeMap((data: Milestone[]) => {
            this.milestoneCache.next(data);
            return this.milestoneCache.asObservable();
          })
        );
    }

    return this.milestoneCache.asObservable();
  }

}
