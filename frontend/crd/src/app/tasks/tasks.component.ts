import { Component } from '@angular/core';
import {TaskService} from "../util/task.service";
import {Task} from "../../domain/Task";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TasksModalComponent } from '../tasks-modal/tasks-modal.component';
import {AuthService} from "../security/auth.service";
import {take} from "rxjs";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less']
})
export class TasksComponent {

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    public matDialog: MatDialog,
  ) {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (user == null) {
        console.error("User does not exist");
      }
      else if (user.studentDetails == undefined) {
        console.error("User does not have student details yet");
      }
      else {
        this.taskService.getDashBoardTasks().subscribe((tasks: Task[]) => {
          this.tasksList = tasks;
        });
      }
    });
  }

  ngOnInit() {

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
    this.matDialog.open(TasksModalComponent, dialogConfig);
  }

  tasksList: Array<Task> = []
}
