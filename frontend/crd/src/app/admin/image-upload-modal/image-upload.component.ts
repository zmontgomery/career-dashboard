import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-image-upload-modal',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less']
})
@Injectable()
export class ImageUploadComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {

  }

  ngOnInit() {

  }

  closeModal() {
    this.dialogRef.close();
  }

}
