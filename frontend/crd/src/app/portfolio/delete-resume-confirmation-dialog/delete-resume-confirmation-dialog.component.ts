import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArtifactService } from 'src/app/file-upload/artifact.service';
import { SubmissionService } from 'src/app/submissions/submission.service';

@Component({
  selector: 'app-delete-resume-confirmation-dialog',
  templateUrl: './delete-resume-confirmation-dialog.component.html',
  styleUrls: ['./delete-resume-confirmation-dialog.component.less']
})
export class DeleteResumeConfirmationDialogComponent {

  readonly artifactId!: number;

  constructor(
    private readonly ref: MatDialogRef<DeleteResumeConfirmationDialogComponent>,
    private readonly artifactService: ArtifactService,
    @Inject(MAT_DIALOG_DATA) data: {artifactId: number},
  ) { 
    this.artifactId = data.artifactId;
  }

  onCancel() {
    this.ref.close(false);
  }

  onConfirm() {
    this.artifactService.deleteArtifact(this.artifactId).subscribe(() => {
      this.ref.close(true);
    });
  }
}
