import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditEducationDialogModule } from './edit-education-dialog/edit-education-dialog.module';
import { EducationSectionComponent } from './education-section.component';

@NgModule({
  declarations: [EducationSectionComponent],
  imports: [
    CommonModule,
    EditEducationDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [EducationSectionComponent],
})
export class EducationSectionModule {}
