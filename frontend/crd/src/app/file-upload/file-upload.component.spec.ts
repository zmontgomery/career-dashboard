import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {MatIconModule} from "@angular/material/icon";

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let httpMock: HttpTestingController;
  let matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
      ],
      declarations: [FileUploadComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: { url: "test-url"} },
        { provide: MatDialogRef, useValue: matDialogRef },
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
