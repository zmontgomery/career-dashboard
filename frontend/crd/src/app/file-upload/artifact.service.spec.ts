import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import {ArtifactService} from "./artifact.service";
import {Artifact} from "../../domain/Artifact";

export const artifactJSON = {
  fileName: "string",
  id: 1,
  submission: "string",
  submissionDate: new Date(),
}

export const artifact = new Artifact(artifactJSON);

describe('ArtifactService', () => {
  let service: ArtifactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // If your service makes HTTP requests
      providers: [ArtifactService], // Include the service to be tested
    });
    service = TestBed.inject(ArtifactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get all artifacts should return list of artifacts', (done) => {
    const artifacts = Array(artifact);
    service.allArtifacts().subscribe((result: any) => {
      expect(result).toEqual(artifacts);
      done();
    });
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.ARTIFACT));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(artifactJSON));
  });

  it('should delete artifact', (done) => {
    service.deleteArtifact(1).subscribe((s) => {
      expect(s).toEqual('test');
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.ARTIFACT) + '1');
    expect(request.request.method).toEqual('DELETE');
    request.flush('test');
  });

  it('should upload artifact', (done) => {
    const mockFile = new File([''], 'example.txt');
    const formData = new FormData();
    formData.append('file', mockFile, mockFile.name);

    service.uploadArtifact(formData).subscribe((s) => {
      expect(s).toEqual(1);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.ARTIFACT));
    expect(request.request.body).toEqual(formData);
    expect(request.request.method).toEqual('POST');
    request.flush(1);
  });

  it('should upload EventImage', (done) => {
    const id = 1;
    const mockFile = new File([''], 'example.png');
    const formData = new FormData();
    formData.append('file', mockFile, mockFile.name);

    service.uploadEventImage(formData, id).subscribe((s) => {
      expect(s).toEqual(1);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(`${Endpoints.UPLOAD_IMAGE_EVENT}/${id}`));
    expect(request.request.body).toEqual(formData);
    expect(request.request.method).toEqual('POST');
    request.flush(1);
  });

  it('should upload artifact', (done) => {
    const mockFile = new File([''], 'example.png');
    const formData = new FormData();
    formData.append('file', mockFile, mockFile.name);

    service.uploadProfilePicture(formData).subscribe((s) => {
      expect(s).toEqual(1);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.USERS_PROFILE_PICTURE));
    expect(request.request.body).toEqual(formData);
    expect(request.request.method).toEqual('POST');
    request.flush(1);
  });

  it('should get file', (done) => {
    const mockFile = new Blob();

    service.getArtifactFile(1).subscribe((blob) => {
      expect(blob).toEqual(mockFile);
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.ARTIFACT_FILE + '/1'));
    expect(request.request.method).toEqual('GET');
    request.flush(mockFile);
  });

  it('should get EventImageURL', () => {
    expect(service.getEventImageUrl(1)).toEqual(constructBackendRequest(`${Endpoints.IMAGE_EVENT}/1`));
  });

  it('should get ProfilePicture', (done) => {
    const mockFile = new Blob();

    service.getProfilePicture().subscribe((blob) => {
      expect(blob).toContain('blob:http://localhost');
      done();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.USERS_PROFILE_PICTURE));
    expect(request.request.method).toEqual('GET');
    request.flush(mockFile);
  });
})
