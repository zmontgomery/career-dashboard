import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Task, TaskJSON } from 'src/domain/Task';
import { concatMap, finalize, map, Observable, of, ReplaySubject } from "rxjs";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskCache$ = new ReplaySubject<any>();
  private hasBeenRequested = false;

  constructor(
    private http: HttpClient,
  ) {
  }

  getTasks(forceRefresh?: boolean): Observable<Task[]> {
    // return last value (i.e. cache) from ReplaySubject or add data to it
    if (!this.hasBeenRequested || forceRefresh) {
      this.hasBeenRequested = true;

      this.http.get<Task[]>(constructBackendRequest(Endpoints.TASKS)).subscribe((data) => {
        console.log("ooo received data");
        console.log(data);
        const mappedData = data.map((taskData: any) => {
            return new Task(taskData)
          })
        this.taskCache$.next(mappedData)
      })
    }

    return this.taskCache$.asObservable();

  }

}
