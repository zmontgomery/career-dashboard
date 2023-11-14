import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {MatIconModule} from "@angular/material/icon";
import {Renderer2} from "@angular/core";

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let httpMock: HttpTestingController;
  let renderer: Renderer2;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<FileUploadComponent>>;
  const testURL: string = "test-url";

  beforeEach(() => {
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
      ],
      declarations: [FileUploadComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: { url: testURL} },
        { provide: MatDialogRef, useValue: matDialogRef },
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get(Renderer2);
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

  function setupUpload() {
    const mockFile = new File([''], 'example.txt');
    const event = renderer.createElement('input');
    event.target = {files: [mockFile]};
    component.onChange(event);

    component.onUpload();

    const request = httpMock.expectOne(testURL);
    expect(request.request.method).toEqual('POST');
    return request;
  }

  it("upload success", fakeAsync (() => {
    const request = setupUpload();
    expect(request.request.method).toEqual('POST');
    request.flush("ok")
    flush();
    expect(matDialogRef.close).toHaveBeenCalled();
  }));

  it("upload failure", fakeAsync (() => {
    const request = setupUpload();
    request.flush(null, {status: 404, statusText: "Not Found"})
    flush();
    expect(matDialogRef.close).not.toHaveBeenCalled();
  }));

  it("close dialog", () => {
    component.onClose();

    expect(matDialogRef.close).toHaveBeenCalled();
  });

});
