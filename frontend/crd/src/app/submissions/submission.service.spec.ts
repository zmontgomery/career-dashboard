import { TestBed } from '@angular/core/testing';

import { SubmissionService } from './submission.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Submission } from 'src/domain/Submission';
import { Endpoints, constructBackendRequest } from '../util/http-helper';

export const submission1JSON = {
  id: 1,
  artifactId: 1,
  taskId: 1,
  studentId: 'asdf',
  submissionDate: new Date(Date.now()),
  comment: 'asdf'
}

export const submission2JSON = {
  id: 1,
  artifactId: 2,
  taskId: 1,
  studentId: 'asdf',
  submissionDate: new Date(Date.now()),
  comment: 'asdf'
}

export const submission1 = new Submission(submission1JSON);
export const submission2 = new Submission(submission2JSON);

describe('SubmissionService', () => {
  let service: SubmissionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [SubmissionService], 
    });
    service = TestBed.inject(SubmissionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit', (done) => {
    service.submit(submission1).subscribe((s) => {
      expect(s).toEqual(submission1);
      done();
    });

    const req = httpMock.expectOne(constructBackendRequest(Endpoints.SUBMISSION));
    expect(req.request.body).toEqual(submission1);
    expect(req.request.method).toEqual('POST');
    req.flush(submission1JSON);
  });

  it('should get latest submission', (done) => {
    service.getLatestSubmission(1).subscribe((s) => {
      expect(s).toEqual(submission1);
      done();
    });

    const req = httpMock.expectOne(constructBackendRequest(Endpoints.SUBMISSION) + '/1');
    expect(req.request.method).toEqual('GET');
    req.flush(submission1JSON);
  });

  it('should get student submission', (done) => {
    service.getStudentSubmissions("asdf").subscribe((s) => {
      expect(s).toEqual([submission1]);
      done();
    });

    const req = httpMock.expectOne(constructBackendRequest(Endpoints.ALL_SUBMISSIONS));
    expect(req.request.method).toEqual('GET');
    req.flush([submission1JSON]);
  });
});
