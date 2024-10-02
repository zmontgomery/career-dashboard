import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DegreeProgramListInputModule } from './degree-program-list-input/degree-program-list-input.module';
import { EditEducationDialogComponent } from './edit-education-dialog.component';

@NgModule({
  declarations: [EditEducationDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    DegreeProgramListInputModule,
  ],
  exports: [EditEducationDialogComponent],
})
export class EditEducationDialogModule {}
