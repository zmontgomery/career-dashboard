import {Component} from '@angular/core';
import {TaskService} from "../util/task.service";
import {Task} from "../../domain/Task";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {TasksModalComponent} from '../tasks-modal/tasks-modal.component';
import {AuthService} from "../security/auth.service";
import {take} from "rxjs";
import {YearLevel} from "../../domain/Milestone";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less']
})
export class TasksComponent {

  userYearLevel: YearLevel = YearLevel.Freshman;
  tasksList: Array<Task> = [];

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
        this.userYearLevel = user.studentDetails.yearLevel;
        this.updateTasks();
      }
    });
  }

  /**
   * Gets the tasks to display on the page
   */
  private updateTasks() {
    this.taskService.getDashBoardTasks(6).subscribe((tasks: Task[]) => {
      this.tasksList = tasks;
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
    dialogConfig.minWidth = "350px";
    dialogConfig.data = {
      task: task,
      overdue: this.isTaskOverdue(task)
    }
    // https://material.angular.io/components/dialog/overview
    const dialogRef = this.matDialog.open(TasksModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.updateTasks();
    })
  }

  /**
   * Check if task is overdue
   * @param task task to be checked
   * @return true if overdue
   */
  isTaskOverdue(task: Task): boolean {
    return  YearLevel.compare(task.yearLevel, this.userYearLevel) < 0;
  }

}
