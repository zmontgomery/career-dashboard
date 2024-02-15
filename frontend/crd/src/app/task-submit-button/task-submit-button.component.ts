import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubmissionModalComponent } from '../submissions/submission-modal/submission-modal.component';
import { Task } from 'src/domain/Task';
import { Endpoints, constructBackendRequest } from '../util/http-helper';

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

  openSubmissionModal() {
    this.dialog.open(SubmissionModalComponent, {
      data: {
        url: constructBackendRequest(Endpoints.ARTIFACT),
        task: this.task,
      }
    });
  }
}
