import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { SubmissionService } from '../submission.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/security/auth.service';
import { Task } from 'src/domain/Task';
import { Submission } from 'src/domain/Submission';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-submission-modal',
  templateUrl: './submission-modal.component.html',
  styleUrls: ['./submission-modal.component.less']
})
export class SubmissionModalComponent implements OnInit, OnDestroy {

  modalState: 'nominal' | 'closing' = 'nominal';

  submitted: boolean = false;
  artifactId: number = 0;
  private url: string;
  private task: Task;

  constructor(
    private readonly submissionService: SubmissionService,
    private readonly authService: AuthService,
    private readonly matDialog: MatDialog,
    private readonly submissionModalRef: MatDialogRef<SubmissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      url: string,
      task: Task 
    },
  ) { 
    this.task = this.data.task;
    this.url = this.data.url;
  }

  ngOnInit(): void {
      this.submissionService.uploadedArtifactId$.subscribe((artifactId) => {
        this.artifactId = artifactId;
      });
  }

  ngOnDestroy(): void {
    console.log('hello');
    if (this.artifactId !== 0) {
      this.submissionService.deleteArtifact(this.artifactId).subscribe(() => {
        setTimeout(() => this.submissionModalRef.close(), 250);
      });
    } else {
      setTimeout(() => this.submissionModalRef.close(), 250);
    }
  }

  onSubmit() {
    this.authService.user$.subscribe((user) => {
      const submission = Submission.make(
        this.artifactId,
        this.task.taskID,
        user!.id,
        new Date(Date.now())
      );
      this.submissionService.submit(submission).subscribe(() => {
        setTimeout(() => this.submissionModalRef.close(), 1000);
      });
    });
  }

  onCancel() {
    this.onClose();
  }

  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file

  private maxSizeMegaBytes = 10;
  private maxSizeBytes = this.maxSizeMegaBytes * 1024 * 1024; // 10 MB

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.size > this.maxSizeBytes) {
        alert(`File size exceeds the maximum allowed size (${this.maxSizeMegaBytes} MB).`)
        // Display an error message or perform other actions
        console.error(`File size exceeds the maximum allowed size (${this.maxSizeMegaBytes} MB).`);
      } else {
        // File is within the allowed size, proceed with handling
        this.status = "initial";
        this.file = file;
      }
    }
  }

  onUpload() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file, this.file.name);

      const upload$ = this.submissionService.uploadArtifact(this.url, formData);

      this.status = 'uploading';

      upload$.pipe(
        catchError((error) => {
          this.status = 'fail';
          console.log(error);
          return of(0);
        })
      ).subscribe((artifactId) => {
        this.status = 'success';
        this.artifactId = artifactId;
      });
    }
  }

  onClose(): void {
    setTimeout(() => this.submissionModalRef.close(), 250);
    this.modalState = 'closing';
  }
}
