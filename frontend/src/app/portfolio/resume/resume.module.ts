import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeComponent } from './resume.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileUploadModule } from 'src/app/file-upload/file-upload.module';
import { DeleteResumeConfirmationDialogModule } from '../delete-resume-confirmation-dialog/delete-resume-confirmation-dialog.module';



@NgModule({
  declarations: [
    ResumeComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FileUploadModule,
    MatDialogModule,
    PdfViewerModule,
    DeleteResumeConfirmationDialogModule,
    MatProgressSpinnerModule
  ],
  exports: [ResumeComponent]
})
export class ResumeModule { }
