import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { Task } from 'src/domain/Task';
import { TaskService } from 'src/app/util/task.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';

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
    private router: Router,
    public matDialog: MatDialog
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

  /**
   * Opens the edit modal, sending the selected task info
   * For creating a new task, the name is the year level and task is null
   */
  openTaskEditModal(name: string, task: Task | null) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      name: name,
      task: task
    }

    const modalDialog = this.matDialog.open(TaskEditModalComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(result => {
      // refresh the task cache before refreshes the component
      this.taskService.getTasks(true);
      this.ngOnInit();
    })
  }

}
