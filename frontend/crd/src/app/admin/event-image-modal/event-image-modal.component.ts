import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Event} from "../../../domain/Event";
import {Observable} from "rxjs";
import {ArtifactService} from "../../file-upload/artifact.service";


@Component({
  selector: 'app-image-upload-modal',
  templateUrl: './event-image-modal.component.html',
  styleUrls: ['./event-image-modal.component.less']
})
@Injectable()
export class EventImageModalComponent implements OnInit {

  private artifactID: number | null = null;
  protected event: Event;
  uploadStrategy: ((formData: FormData) => Observable<number>) | null = null;

  constructor(
    public dialogRef: MatDialogRef<EventImageModalComponent>,
    private artifactService: ArtifactService,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {
    this.event = this.modalData?.event;
    if (this.event !== undefined) {
      this.uploadStrategy = (data) => {
        return this.artifactService.uploadEventImage(data, this.event.eventID);
      }
      this.uploadStrategy.bind(this);
    }
    else {
      console.error("expected modal data to contain an event");
    }
  }

  ngOnInit() {

  }

  closeModal(waitTime: number) {
    setTimeout(() => this.dialogRef.close(this.artifactID), waitTime)
  }

  onArtifactId(id: number) {
    this.artifactID = id;
  }
}
