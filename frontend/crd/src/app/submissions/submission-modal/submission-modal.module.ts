import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionModalComponent } from './submission-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FileUploadModule } from 'src/app/file-upload/file-upload.module';



@NgModule({
  declarations: [
    SubmissionModalComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FileUploadModule,
    MatDialogModule,
  ],
  exports: [
    SubmissionModalComponent
  ]
})
export class SubmissionModalModule { }
