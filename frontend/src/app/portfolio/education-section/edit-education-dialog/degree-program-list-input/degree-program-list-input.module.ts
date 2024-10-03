import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DegreeProgramListInputComponent } from './degree-program-list-input.component';

@NgModule({
  declarations: [DegreeProgramListInputComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [DegreeProgramListInputComponent],
})
export class DegreeProgramListInputModule {}
