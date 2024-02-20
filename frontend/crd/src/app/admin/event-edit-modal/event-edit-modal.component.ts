import { HttpClient } from '@angular/common/http';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from "../../../domain/Event";


@Component({
  selector: 'app-event-edit-modal',
  templateUrl: './event-edit-modal.component.html',
  styleUrls: ['./event-edit-modal.component.less']
})
@Injectable()
export class EventEditModalComponent implements OnInit {

  eventForm!: FormGroup;
  public currentEvent: Event | undefined;
  public eventName: string = '';


  constructor(
    public dialogRef: MatDialogRef<EventEditModalComponent>,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {

    if (this.modalData.event) {
      console.log("editing an event")
      this.currentEvent = this.modalData.event;
      this.eventName = this.modalData.event.name;
      console.log("event datetime:")
      console.log(this.currentEvent?.date)
    }
    else {
      console.log("creating an event")
      //this.tYearLevel = this.modalData.name;
      //this.taskName = '';
    }
  }

  ngOnInit() { 
    this.createForm();
  }

  createForm() {
    if (this.currentEvent) {
      this.eventForm = this.formBuilder.group({
        name: [this.eventName],   //this field is hidden if the task already exists
        date: [this.currentEvent.date],
        description: [this.currentEvent.description],
        location: [this.currentEvent.location],
        organizer: [this.currentEvent.organizer],
        link: [this.currentEvent.eventLink],
        buttonLabel: [this.currentEvent.buttonLabel],
        recurring: [this.currentEvent.isRecurring],
      });
    }

    else {
      this.eventForm = this.formBuilder.group({
        name: [null, Validators.required],   //this field is hidden if the task already exists
        date: [null, Validators.required],
        description: [null],
        location: [null, Validators.required],
        organizer: [null, Validators.required],
        link: [null],
        buttonLabel: [null],
        recurring: [false],
      });
    }
  }


  closeModal() {
    this.dialogRef.close();
  }

  saveEvent() {
    console.log("saving event!")
  }

}
