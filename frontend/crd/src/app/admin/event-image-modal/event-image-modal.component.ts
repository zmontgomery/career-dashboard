import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UploadType} from "../../file-upload/image-upload.component";
import {Event} from "../../../domain/Event";


@Component({
  selector: 'app-image-upload-modal',
  templateUrl: './event-image-modal.component.html',
  styleUrls: ['./event-image-modal.component.less']
})
@Injectable()
export class EventImageModalComponent implements OnInit {

  protected uploadType: UploadType;
  protected uploadID: number | null = null;
  private artifactID: number | null = null;
  protected event: Event;

  constructor(
    public dialogRef: MatDialogRef<EventImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {
    this.event = this.modalData.event;
    if (this.event !== undefined) {
      this.uploadID = this.event.eventID;
      this.uploadType = UploadType.EventImage;
    } else {
      this.uploadType = UploadType.ProfileImage;
    }
  }

  ngOnInit() {

  }

  closeModal(waitTime: number) {
    setTimeout(() => this.dialogRef.close(this.artifactID), waitTime)
  }

  protected readonly UploadType = UploadType;

  onArtifactId(id: number) {
    this.artifactID = id;
  }
}
