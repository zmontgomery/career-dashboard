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

  /**
   * Gets all the tasks and caches the response
   *
   * If the cache has data in it, it returns the value of the cache, otherwise
   * it makes a request to the backend.
   * @param forceRefresh forces the cache to update by sending the request again
   */
  getTasks(forceRefresh?: boolean): Observable<Task[]> {
    if (!this.hasBeenRequested || forceRefresh) {
      this.hasBeenRequested = true;

      this.http.get<Task[]>(constructBackendRequest(Endpoints.TASKS)).subscribe((data) => {
        const mappedData = data.map((taskData: any) => {
            //if the milestone is sent as a object and not just the ID, extract the ID
            if (taskData.milestone) {
              const taskMilestone = taskData.milestone.id;
              taskData.milestoneID = taskMilestone;
            }
            if (taskData.event) {
              const taskEvent = taskData.event.id;
              taskData.eventID = taskEvent;
            }

            return new Task(taskData)
          })
        this.taskCache$.next(mappedData)
      })
    }

    return this.taskCache$.asObservable();

  }

  getDashBoardTasks(): Observable<Task[]> {
    return this.http.get<TaskJSON[]>(constructBackendRequest(Endpoints.DASHBOARD_TASKS))
      .pipe(map((data) => data.map((taskData: any) => new Task(taskData))))
  }

  /**
   * API call to get data for a specific task
   */
  findById(id: number): Observable<Task> {
    return this.http.get<TaskJSON>(constructBackendRequest(`${Endpoints.TASKS}/${id}`))
      .pipe(map((taskJSON) => new Task(taskJSON)));
  }

}
