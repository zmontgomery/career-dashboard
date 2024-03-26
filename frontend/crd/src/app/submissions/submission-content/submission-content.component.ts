import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AuthService } from 'src/app/security/auth.service';
import { Task } from 'src/domain/Task';
import { SubmissionService } from '../submission.service';
import { Submission } from 'src/domain/Submission';
import { ArtifactService } from 'src/app/file-upload/artifact.service';

@Component({
  selector: 'app-submission-content',
  templateUrl: './submission-content.component.html',
  styleUrls: ['./submission-content.component.less']
})
export class SubmissionContentComponent implements OnDestroy {
  @Input() task!: Task;

  state: 'nominal' | 'cancelling' | 'submitting' = 'nominal';
  submitted: boolean = false;
  artifactId: number = 0;
  commentString: string = '';

  @Output() cancel = new EventEmitter()

  constructor(
    private readonly authService: AuthService,
    private readonly submissionService: SubmissionService,
    private readonly artifactService: ArtifactService
  ) {}

  /**
   * Deletes the artifact from the server if it has been uploaded without a
   * submission being created
   */
  ngOnDestroy(): void {
    if (this.artifactId > 1 && this.state !== 'submitting') {
      this.artifactService.deleteArtifact(this.artifactId).subscribe(() => {
        this.onCancel();
      });
    } else {
      this.onCancel();
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
        this.state = 'submitting';
        this.onCancel();
      });
    });
  }


  /**
   * Determines if the button can be enabled
   */
  isEnabled(): boolean {
    return this.state === 'nominal';
  }

  /**
   * Closes the submission modal
   */
  onCancel() {
    this.cancel.emit();
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
