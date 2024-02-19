import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ArtifactService} from "../file-upload/artifact.service";
import { TaskService } from '../util/task.service';
import { SubmissionModalComponent } from '../submissions/submission-modal/submission-modal.component';
import { SubmissionService } from '../submissions/submission.service';

const RESUME_TASK_ID = 6;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent {
  showUploadButton: boolean = true;
  pdfURL: any = '';

  constructor(
    public dialog: MatDialog,
    private readonly artifactService: ArtifactService,
    private readonly submissionService: SubmissionService,
    private readonly taskService: TaskService
  ) {
    this.updateArtifacts();
  }

  private updateArtifacts() {
    this.submissionService.getLatestSubmission(RESUME_TASK_ID).subscribe((submission) => {
      this.artifactService.getArtifactFile(submission.artifactId).subscribe((file) => {
        this.pdfURL = URL.createObjectURL(file);
        this.showUploadButton = false;
      });
    });
  }

  openDialog(): void {
    this.taskService.findById(RESUME_TASK_ID).subscribe((task) => {
      this.dialog.open(SubmissionModalComponent, {
        data: {
          task: task
        }
      })
        // this could definitely be optimized, but for now we can do this
        .afterClosed().subscribe(this.updateArtifacts.bind(this))
    });
  }
}
