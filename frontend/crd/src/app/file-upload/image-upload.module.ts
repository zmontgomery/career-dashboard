import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ImageUploadComponent } from './image-upload.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {ImageCropperModule} from "ngx-image-cropper";



@NgModule({
  declarations: [
    ImageUploadComponent,
  ],
  exports: [
    ImageUploadComponent
  ],
    imports: [
        CommonModule,
        MatProgressBarModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        ImageCropperModule,
    ]
})
export class ImageUploadModule { }
