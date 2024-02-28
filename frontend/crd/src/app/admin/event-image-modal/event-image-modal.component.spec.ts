import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventImageModalComponent } from './event-image-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MockComponent} from "ng-mocks";
import {ImageUploadComponent} from "../../file-upload/image-upload.component";
import {EventJSON, Event} from "../../../domain/Event";

describe('EventImageModalComponent', () => {
  let component: EventImageModalComponent;
  let fixture: ComponentFixture<EventImageModalComponent>;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
  const eventJSON: EventJSON = {
    name: 'string',
    description: 'string',
    date: 'string',
    id: 1,
    recurring: true,
    organizer: 'string',
    location: 'string',
    eventLink: 'string',
    buttonLabel: 'string',
    imageId: 1,
  }
  let event: Event = new Event(eventJSON);


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventImageModalComponent],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MockComponent(ImageUploadComponent),
      ],
      providers: [
        MatDialog,
        FormBuilder,
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {event}},
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(EventImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
