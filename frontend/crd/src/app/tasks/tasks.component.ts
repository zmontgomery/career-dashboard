import { Component } from '@angular/core';
import {TaskService} from "../util/task.service";
import {Task} from "../../domain/Task";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TasksModalComponent } from '../tasks-modal/tasks-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less']
})
export class TasksComponent {

  constructor(
    private taskService: TaskService,
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.taskService.getTasks(true).subscribe((tasks: Task[]) => {
      this.tasksList = tasks;
    });
  }

  openTask(task: any) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "80%";
    dialogConfig.width = "60%";
    dialogConfig.data = {
      task: task
    }
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(TasksModalComponent, dialogConfig);
  }

  tasksList: Array<Task> = []
}
