import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {MatIconModule} from "@angular/material/icon";
import {Renderer2} from "@angular/core";
import { ArtifactService } from './artifact.service';
import { constructBackendRequest, Endpoints } from '../util/http-helper';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let httpMock: HttpTestingController;
  let renderer: Renderer2;
  let artifactServiceSpy: jasmine.SpyObj<ArtifactService>;

  beforeEach(() => {
    artifactServiceSpy = jasmine.createSpyObj('ArtifactService', ['deleteArtifact', 'uploadArtifact']);
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
      ],
      declarations: [FileUploadComponent],
      providers: [
        {provide: ArtifactService, artifactServiceSpy},
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
    expect(component.status).toBe('initial');
    expect(component.file).toEqual(mockFile);
  });

  function setupUpload() {
    const mockFile = new File([''], 'example.txt');
    const event = renderer.createElement('input');
    event.target = {files: [mockFile]};
    component.onChange(event);

    component.onUpload();
  }

  it('should delete on cancel', (done) => {
    component.artifactId = 2;
    component.status = 'success';
    component.artifactIdEmitter.subscribe((id) => {
      expect(id).toEqual(0);
      done();
    });

    component.onCancel();

    expect(component.file).toBeNull();
    
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.ARTIFACT) + '2');
    expect(request.request.method).toEqual('DELETE');
  });

  it('should not delete when there is no artifact', (done) => {
    component.artifactId = 1;
    component.status = 'success';
    component.artifactIdEmitter.subscribe((id) => {
      expect(id).toEqual(0);
      done();
    });

    component.onCancel();

    expect(component.file).toBeNull();
    
    httpMock.expectNone(constructBackendRequest(Endpoints.ARTIFACT) + '1');
  });

  it('should upload if file exists', (done) => {
    setupUpload();

    component.artifactIdEmitter.subscribe((id) => {
      expect(id).toEqual(2);
      done();
    });

    const req = httpMock.expectOne(constructBackendRequest(Endpoints.ARTIFACT));
    expect(req.request.method).toEqual('POST');
    req.flush(2);

    expect(component.artifactId).toEqual(2);
    expect(component.status).toEqual('success');
  });

  it ('should not upload if file does not exist', () => {
    component.file = null;

    httpMock.expectNone(constructBackendRequest(Endpoints.ARTIFACT));
    expect(component.artifactId).toEqual(1);
    expect(component.status).toEqual('initial');
  });
});
