import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import {ArtifactService} from "./artifact.service";
import {Artifact} from "../../domain/Artifact";

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

  it('getPortfolioArtifacts should return list of artifacts', () => {
    const artifactJSON = {
      fileName: "string",
      id: 1,
      submission: "string",
      submissionDate: new Date(),
    }

    const artifacts = Array(new Artifact(artifactJSON));
    service.getPortfolioArtifacts().subscribe((result: any) => {
      expect(result).toEqual(artifacts);
    });
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.ARTIFACTS));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(artifactJSON));
  });


})
