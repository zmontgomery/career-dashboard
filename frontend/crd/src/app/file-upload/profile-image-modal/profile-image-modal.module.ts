import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileImageModalComponent } from './profile-image-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {FileUploadModule} from "../file-upload.module";
import {MatButtonModule} from "@angular/material/button";
import {ImageUploadModule} from "../image-upload.module";
import {MatListModule} from "@angular/material/list";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    ProfileImageModalComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FileUploadModule,
    MatButtonModule,
    ImageUploadModule,
    MatListModule,
    MatDialogModule
  ]
})
export class ProfileImageModalModule { }
