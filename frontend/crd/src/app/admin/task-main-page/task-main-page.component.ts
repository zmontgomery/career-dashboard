import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { Task } from 'src/domain/Task';
import { TaskService } from 'src/app/util/task.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-main-page',
  templateUrl: './task-main-page.component.html',
  styleUrls: ['./task-main-page.component.less']
})
export class TaskMainPageComponent implements OnDestroy {

  private destroyed$ = new Subject<any>();

  taskMap: Map<string, Array<Task>> = new Map()

  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next("");
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.taskService.getTasks()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tasks: Task[]) => {
        this.yearLevels.forEach((yearLevel) => this.taskMap.set(yearLevel, new Array<Task>()));
        tasks.forEach((task) => this.taskMap.get(task.yearLevel)?.push(task));
    });
  }

  editTask(name: string) {
    //const encodedName = encodeURIComponent(name);
    //this.router.navigate(['/admin/task-edit', encodedName]);
  }

}
