import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UploadType} from "../../file-upload/file-upload.component";
import {Event} from "../../../domain/Event";


@Component({
  selector: 'app-image-upload-modal',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less']
})
@Injectable()
export class ImageUploadComponent implements OnInit {

  protected uploadType: UploadType;
  protected uploadID: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {
    const event: Event = this.modalData.event;
    if (event !== undefined) {
      this.uploadID = event.eventID;
      this.uploadType = UploadType.EventImage;
    } else {
      this.uploadType = UploadType.ProfileImage;
    }
  }

  ngOnInit() {

  }

  closeModal() {
    this.dialogRef.close();
  }

  protected readonly UploadType = UploadType;
}
