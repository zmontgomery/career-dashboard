import { Component } from '@angular/core';
import {TasksService} from "./tasks.service";
import {Task} from "../../domain/Task";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less']
})
export class TasksComponent {

  constructor(
    private tasksService: TasksService,
  ) {
  }

  ngOnInit() {
    this.tasksService.getTasks().subscribe((tasks: Task[]) => {
      this.tasksList = tasks;
    });
  }

  tasksList: Array<Task> = []
}
