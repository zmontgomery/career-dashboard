import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Submission, SubmissionJSON } from 'src/domain/Submission';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { Observable, catchError, map, of } from 'rxjs';

/**
 * Service to interact with artifacts
 */
@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private readonly http: HttpClient
  ) { }

  /**
   * Submits a submission and returnes the submitted submission
   */
  submit(submission: Submission): Observable<Submission> {
    return this.http.post<SubmissionJSON>(constructBackendRequest(Endpoints.SUBMISSION), submission)
      .pipe(map((s) => new Submission(s)));
  }

  delete(submissionId: number): Observable<string> {
    return this.http.delete<string>(constructBackendRequest(`${Endpoints.SUBMISSION}/${submissionId}`));
  }

  /**
   * Retrieves the latest submission for a task
   */
  getLatestSubmission(taskId: number): Observable<Submission> {
    return this.http.get<SubmissionJSON>(constructBackendRequest(`${Endpoints.SUBMISSION}/${taskId}`))
      .pipe(
        map((s) => new Submission(s)),
        catchError(() => of(Submission.makeEmpty())),
      );
  }

  /**
   * Retrieves all submissions for a given user
   */
  getStudentSubmissions(studentID: string): Observable<Submission[]> {
    return this.http.get<SubmissionJSON[]>(constructBackendRequest(`${Endpoints.ALL_SUBMISSIONS}`))
      .pipe(map((data: SubmissionJSON[]) => {
        return data.map((s: SubmissionJSON) => {
          return new Submission(s);
        });
      }));
  }
}
