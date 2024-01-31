import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import {Task} from "../../domain/Task";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private http: HttpClient,
  ) {
  }

  // Get all data items
  getTasks(): Observable<Task[]> {
    return of([
      new Task({
        name: "string",
        description: "string",
        needsArtifact: true,
        id: "1",
        isRequired: true,
        submission: "any",
      }),
      new Task({
        name: "string2",
        description: "string2",
        needsArtifact: true,
        id: "2",
        isRequired: true,
        submission: "any",
      }),
    ]);
    //TODO Fix following code to retrieve task data from API
    // return this.http.get<Task[]>(constructBackendRequest(Endpoints.TASKS))
    //   .pipe(map((data: any) => {
    //     return data.map((tasksData: TasksJSON) => {
    //       return new Task(tasksData)
    //     })
    //   }))
  }
}
