import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionContentComponent } from './submission-content.component';
import { FileUploadModule } from 'src/app/file-upload/file-upload.module';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [SubmissionContentComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FileUploadModule,
    MatDialogModule,
    FormsModule
  ],
  exports: [SubmissionContentComponent]
})
export class SubmissionContentModule { }
