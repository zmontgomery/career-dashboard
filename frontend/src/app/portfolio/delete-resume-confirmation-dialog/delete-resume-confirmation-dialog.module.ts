import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteResumeConfirmationDialogComponent } from './delete-resume-confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    DeleteResumeConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [DeleteResumeConfirmationDialogComponent]
})
export class DeleteResumeConfirmationDialogModule { }
