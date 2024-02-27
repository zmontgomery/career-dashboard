import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubmissionModalComponent } from '../submissions/submission-modal/submission-modal.component';
import { Task } from 'src/domain/Task';

/**
 * Button to open a submission modal with the given task
 */
@Component({
  selector: 'app-task-submit-button',
  templateUrl: './task-submit-button.component.html',
  styleUrls: ['./task-submit-button.component.less']
})
export class TaskSubmitButtonComponent {
  constructor(
    private readonly dialog: MatDialog,
  ) {  }

  @Input() task: Task | null = null;

  /**
   * Opens a submission modal with the given task
   */
  openSubmissionModal() {
    this.dialog.open(SubmissionModalComponent, {
      data: {
        task: this.task,
      }
    });
  }
}
