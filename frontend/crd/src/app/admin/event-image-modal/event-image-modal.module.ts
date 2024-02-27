import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventImageModalComponent } from './event-image-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {FileUploadModule} from "../../file-upload/file-upload.module";
import {MatButtonModule} from "@angular/material/button";
import {ImageUploadModule} from "../../file-upload/image-upload.module";

@NgModule({
  declarations: [
    EventImageModalComponent
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
    ImageUploadModule
  ]
})
export class EventImageModalModule { }
