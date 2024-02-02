import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Task} from "../../domain/Task";
import {YearLevel} from "../../domain/Milestone";

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
        yearLevel: YearLevel.Freshman,
        milestoneID: "1",
      }),
      new Task({
        name: "string2",
        description: "string2",
        needsArtifact: true,
        id: "2",
        isRequired: true,
        submission: "any",
        yearLevel: YearLevel.Sophomore,
        milestoneID: "1",
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
