import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import { AuthService } from '../security/auth.service';
import { LangUtils } from '../util/lang-utils';
import { User } from '../security/domain/user';
import {ArtifactService} from "../file-upload/artifact.service";
import { TaskService } from '../util/task.service';
import { SubmissionModalComponent } from '../submissions/submission-modal/submission-modal.component';
import { SubmissionService } from '../submissions/submission.service';
import { DeleteResumeConfirmationDialogComponent } from './delete-resume-confirmation-dialog/delete-resume-confirmation-dialog.component';

const RESUME_TASK_ID = 6;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit{

  NO_FILE = 1;

  user: User = User.makeEmpty();
  artifactId: number = 0;
  showUploadButton: boolean = true;
  pdfURL: any = '';

  constructor(
    public dialog: MatDialog,
    private readonly artifactService: ArtifactService,
    private readonly submissionService: SubmissionService,
    private readonly taskService: TaskService,
    private readonly authService: AuthService
  ) {
    this.updateArtifacts();
  }

  formatDate(date: Date){
    return date.toLocaleString("en-US", {month: "long", year: "numeric", day: "numeric"});
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.user = user!;
      }
    });
  }

  private updateArtifacts() {
    this.submissionService.getLatestSubmission(RESUME_TASK_ID).subscribe((submission) => {
      this.artifactId = submission.artifactId;
      if (submission.artifactId !== this.NO_FILE) {
        this.artifactService.getArtifactFile(submission.artifactId).subscribe((file) => {
          this.pdfURL = URL.createObjectURL(file);
          this.showUploadButton = false;
        });
      } else {
        this.pdfURL = '';
        this.showUploadButton = true;
      }
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

  deleteResume() {
    const confirmationDialog = this.dialog.open(DeleteResumeConfirmationDialogComponent, {
      data: {artifactId: this.artifactId}
    });

    confirmationDialog.afterClosed().subscribe((deleted: boolean) => {
      if (deleted) this.updateArtifacts()
    });
  }

  canDelete(): boolean {
    return this.artifactId !== 0 && this.artifactId !== this.NO_FILE;
  }
}
