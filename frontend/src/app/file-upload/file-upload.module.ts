import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";



@NgModule({
  declarations: [
    FileUploadComponent,
  ],
  exports: [
    FileUploadComponent
  ],
    imports: [
        CommonModule,
        MatProgressBarModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
    ]
})
export class FileUploadModule { }
