import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Submission, SubmissionJSON } from 'src/domain/Submission';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private readonly http: HttpClient
  ) { }

  submit(submission: Submission): Observable<Submission> {
    return this.http.post<SubmissionJSON>(constructBackendRequest(Endpoints.SUBMISSION), submission)
      .pipe(map((s) => new Submission(s)));
  }

  getLatestSubmission(taskId: number): Observable<Submission> {
    return this.http.get<Submission>(constructBackendRequest(`${Endpoints.SUBMISSION}/${taskId}`));
  }
}
