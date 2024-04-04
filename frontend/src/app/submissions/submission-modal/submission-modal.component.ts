import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/domain/Task';

/**
 * Component for the submission modal that allows a user to submit
 * artifacts and other information to the server
 */
@Component({
  selector: 'app-submission-modal',
  templateUrl: './submission-modal.component.html',
  styleUrls: ['./submission-modal.component.less']
})
export class SubmissionModalComponent {
  task: Task;

  private readonly closeTime: number = 100; // Delay before the modal closes

  constructor(
    private readonly submissionModalRef: MatDialogRef<SubmissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      task: Task
    },
  ) {
    this.task = this.data.task;
  }

  onCancel() {
    setTimeout(() => this.submissionModalRef.close(), this.closeTime);
  }
}
