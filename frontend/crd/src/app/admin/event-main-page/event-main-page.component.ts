import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/dashboard/events/event.service';
import { Event } from "../../../domain/Event";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventEditModalComponent } from '../event-edit-modal/event-edit-modal.component';
import {EventImageModalComponent} from "../event-image-modal/event-image-modal.component";
import {ArtifactService} from "../../file-upload/artifact.service";
import {Endpoints} from "../../util/http-helper";

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
    });
  }

  /**
   * Opens the edit modal and sends it the event object
   */
  openEventEditModal(event: Event | null) {
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
      this.ngOnInit();  // refresh to show new event
    })
  }

  /**
   * Opens the image edit modal and sends it the event object
   */
  openEventImageModal(event: Event) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "500px";
    dialogConfig.data = {
      event: event
    }

    const modalDialog = this.matDialog.open(EventImageModalComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(result => {
      if (result != null) {
        event.imageId = result;
      }
    })
  }

  protected readonly Endpoints = Endpoints;

  /**
   * Gets the url to use in the html
   * References the artifact service for the file logic
   */
  eventImageUrl(imageId: number): string {
    return  this.artifactService.getEventImageUrl(imageId)
  }
}
