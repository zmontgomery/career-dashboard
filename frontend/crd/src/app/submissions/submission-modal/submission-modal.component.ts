import { Component, Inject, OnDestroy } from '@angular/core';
import { SubmissionService } from '../submission.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/security/auth.service';
import { Task } from 'src/domain/Task';
import { Submission } from 'src/domain/Submission';
import { ArtifactService } from 'src/app/file-upload/artifact.service';
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * Component for the submission modal that allows a user to submit
 * artifacts and other information to the server
 */
@Component({
  selector: 'app-submission-modal',
  templateUrl: './submission-modal.component.html',
  styleUrls: ['./submission-modal.component.less']
})
export class SubmissionModalComponent implements OnDestroy {
  modalState: 'nominal' | 'cancelling' | 'submitting' = 'nominal';
  submitted: boolean = false;
  artifactId: number = 0;
  commentString: string = '';
  task: Task;

  private readonly closeTime: number = 100; // Delay before the modal closes

  constructor(
    private readonly submissionService: SubmissionService,
    private readonly artifactService: ArtifactService,
    private readonly authService: AuthService,
    private _snackBar: MatSnackBar,
    private readonly submissionModalRef: MatDialogRef<SubmissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      task: Task
    },
  ) {
    this.task = this.data.task;
  }

  /**
   * Deletes the artifact from the server if it has been uploaded without a
   * submission being created
   */
  ngOnDestroy(): void {
    if (this.artifactId > 1 && this.modalState !== 'submitting') {
      this.artifactService.deleteArtifact(this.artifactId).subscribe(() => {
        setTimeout(() => this.submissionModalRef.close(), this.closeTime);
      });
    } else {
      setTimeout(() => this.submissionModalRef.close(), this.closeTime);
    }
  }

  /**
   * Creates a submission object and submits that to the backend
   */
  onSubmit() {
    this.authService.user$.subscribe((user) => {
      const submission = Submission.make(
        this.artifactId,
        this.task.taskID,
        user!.id,
        new Date(Date.now()),
        this.commentString
      );
      this.submissionService.submit(submission).subscribe(() => {
        this.modalState = 'submitting';
        setTimeout(() => this.submissionModalRef.close(), this.closeTime);
        // TODO error check?
        this._snackBar.open("Submission Successful!", 'close', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
        });
      });
    });
  }

  /**
   * Closes the submission modal
   */
  onCancel() {
    this.modalState = 'cancelling';
    setTimeout(() => this.submissionModalRef.close(), this.closeTime);
  }

  /**
   * Determines if the button can be enabled
   */
  isEnabled(): boolean {
    return this.modalState === 'nominal';
  }

  /**
   * Determines if a submission can be made
   */
  canSubmit(): boolean {
    return this.task.needsArtifact() ? this.artifactId > 1 : this.commentString !== '';
  }

  /**
   * Sets the artifact id for the submission
   */
  onArtifactId(id: number) {
    this.artifactId = id;
  }

  needsArtifact(): boolean {
    return this.task.needsArtifact();
  }
}
