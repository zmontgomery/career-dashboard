import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/dashboard/events/event.service';
import { Event } from "../../../domain/Event";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventEditModalComponent } from '../event-edit-modal/event-edit-modal.component';
import {ImageUploadComponent} from "../image-upload-modal/image-upload.component";
import {ArtifactService} from "../../file-upload/artifact.service";
import {Endpoints} from "../../util/http-helper";
import {map} from "rxjs";

@Component({
  selector: 'app-event-main-page',
  templateUrl: './event-main-page.component.html',
  styleUrls: ['./event-main-page.component.less']
})
export class EventMainPageComponent implements OnInit {

  events: Array<Event> = []
  eventUrlsMap: Map<number, string> = new Map<number, string>();

  constructor(
    private eventService: EventService,
    public matDialog: MatDialog,
    private artifactService: ArtifactService,
  ) {
  }

  ngOnInit() {
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
      events.forEach((event) => this.updateImage(event));
    });
  }

  private updateImage(event: Event) {
    if (event.imageId != null) {
      this.artifactService.getImage(event.imageId).pipe(map(
        (file) => URL.createObjectURL(file))).subscribe((url) => {
        this.eventUrlsMap = this.eventUrlsMap.set(event.eventID, url);
      });
    }
  }

  openEventEditModal(event: Event | null) {
    console.log("clicked on event modal")
    console.log(event);

    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      event: event
    }

    const modalDialog = this.matDialog.open(EventEditModalComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(result => {
      //TODO: successful save popup?
      //this.eventService.getEvents();
      this.ngOnInit();
    })
  }

  openEventImageModal(event: Event) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      event: event
    }

    const modalDialog = this.matDialog.open(ImageUploadComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(result => {
      event.imageId = result;
      this.updateImage(event);
    })
  }

  protected readonly Endpoints = Endpoints;
}
