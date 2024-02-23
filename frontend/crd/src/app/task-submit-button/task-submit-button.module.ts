import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskSubmitButtonComponent } from './task-submit-button.component';
import { MatButtonModule } from '@angular/material/button';
import { SubmissionModalComponent } from '../submissions/submission-modal/submission-modal.component';
import { SubmissionModalModule } from '../submissions/submission-modal/submission-modal.module';



@NgModule({
  declarations: [
    TaskSubmitButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  exports: [
    TaskSubmitButtonComponent,
    SubmissionModalModule,
  ]
})
export class TaskSubmitButtonModule { }
