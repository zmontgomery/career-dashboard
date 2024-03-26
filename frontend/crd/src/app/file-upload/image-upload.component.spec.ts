import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ImageUploadComponent } from './image-upload.component';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {MatIconModule} from "@angular/material/icon";
import {Renderer2} from "@angular/core";
import {ArtifactService} from "./artifact.service";
import createSpyObj = jasmine.createSpyObj;
import {of, Subject} from "rxjs";
import SpyObj = jasmine.SpyObj;
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;
  let httpMock: HttpTestingController;
  let renderer: Renderer2;
  const testURL: string = "test-url";
  const file = new File([], 'name');
  let uploadSubject: Subject<number>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        MatIconModule,
      ],
      declarations: [ImageUploadComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: { url: testURL} },
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get(Renderer2);
    uploadSubject = new Subject<number>();
    component.uploadStrategy = () => uploadSubject.asObservable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('change file', () => {
    const mockFile = new File([''], 'example.txt');
    const event = renderer.createElement('input');
    event.target = { files: [mockFile] };
    component.onChange(event)
  });

  it("close dialog", fakeAsync(() => {
    spyOn(component.closeEmitter, 'emit');
    component.closeModal();
    tick();
    expect(component.closeEmitter.emit).toHaveBeenCalled();
  }));

  it('done cropping', () => {
    component.status = 'cropping';
    component.doneCropping();
    expect(component.status).toEqual('initial');
  });

  it('done cropping', () => {
    component.status = 'cropping';
    component.onCancel();
    expect(component.status).toEqual('initial');
  });

  it('format bytes', () => {
    expect(component.formatBytes()).toEqual('0 bytes');
  });

  it('upload error', () => {
    component.rawFile = file;
    component.croppedFile = file;
    component.onUpload();
    // @ts-ignore
    uploadSubject.next(null);
    expect(component.status).toEqual('error');
  });

  it('upload uploading', () => {
    component.rawFile = file;
    component.croppedFile = file;
    component.onUpload();
    expect(component.status).toEqual('uploading');
  });

  it('upload success', () => {
    component.rawFile = file;
    component.croppedFile = file;
    component.onUpload();
    uploadSubject.next(1);
    expect(component.status).toEqual('success');
  });

});
