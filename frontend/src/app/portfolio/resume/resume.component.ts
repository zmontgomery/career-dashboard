import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ArtifactService } from 'src/app/file-upload/artifact.service';
import { SubmissionModalComponent } from 'src/app/submissions/submission-modal/submission-modal.component';
import { SubmissionService } from 'src/app/submissions/submission.service';
import { TaskService } from 'src/app/util/task.service';
import { Submission } from 'src/domain/Submission';
import { DeleteResumeConfirmationDialogComponent } from '../delete-resume-confirmation-dialog/delete-resume-confirmation-dialog.component';
import { User } from 'src/app/security/domain/user';
import { BehaviorSubject } from 'rxjs';

const RESUME_TASK_ID = 6;

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.less']
})
export class ResumeComponent implements OnInit, OnChanges {

  @Input() user!: User;
  @Input() external: boolean = false;

  NO_FILE = 1;

  artifactId: number = 0;
  showUploadButton: boolean = true;
  pdfURL: any = '';

  private readonly resumeLoadedSubject = new BehaviorSubject<boolean>(false);
  readonly resumeLoaded$ = this.resumeLoadedSubject.asObservable();

  constructor(
    public dialog: MatDialog,
    private readonly artifactService: ArtifactService,
    private readonly submissionService: SubmissionService,
    private readonly taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.fetchCurrentArtifact();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchCurrentArtifact();
    console.log(this.external);
  }

  /**
   * Grabs the Student's artifacts to be displayed.
   * Currently just grabs the resume
   */
  fetchCurrentArtifact() {
    const submissionObservable = this.external ? this.submissionService.getLatestSubmission(RESUME_TASK_ID, this.user.id) :
      this.submissionService.getLatestSubmission(RESUME_TASK_ID)

    submissionObservable.subscribe((submission) => {
      this.loadSubmission(submission);
    });
  }

  /**
   * Opens the Submission Modal
   */
  openDialog(): void {
    this.taskService.findById(RESUME_TASK_ID).subscribe((task) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.maxWidth = '90vw';
      dialogConfig.data = {
        task: task
      }
      this.dialog.open(SubmissionModalComponent, dialogConfig)
        // this could definitely be optimized, but for now we can do this
        .afterClosed().subscribe(this.fetchCurrentArtifact.bind(this))
    });
  }


  /**
   * Deletes the resume
   */
  deleteResume() {
    const confirmationDialog = this.dialog.open(DeleteResumeConfirmationDialogComponent, {
      data: {artifactId: this.artifactId}
    });

    confirmationDialog.afterClosed().subscribe((deleted: boolean) => {
      if (deleted) this.fetchCurrentArtifact()
    });
  }

  /**
   * Determines if the delete button can be displayed
   */
  canDelete(): boolean {
    return this.artifactId !== 0 && this.artifactId !== this.NO_FILE && !this.external;
  }

  /**
   * Determines if the upload button can be shown
   */
  showUpload(): boolean {
    return this.showUploadButton && !this.external;
  }

  showResume(): boolean {
    return !this.showUploadButton;
  }

  private loadSubmission(submission: Submission) {
    if (submission.hasFile()) {
      this.artifactId = submission.artifactId;
      this.artifactService.getArtifactFile(submission.artifactId).subscribe((file) => {
        this.pdfURL = URL.createObjectURL(file);
        this.showUploadButton = false;
        this.resumeLoadedSubject.next(true);
      });
    } else {
      this.pdfURL = '';
      this.showUploadButton = true;
      this.artifactId = this.NO_FILE;
      this.resumeLoadedSubject.next(true);
    }
  }
}
