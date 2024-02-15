import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Submission, SubmissionJSON } from 'src/domain/Submission';
import { Endpoints, constructBackendRequest } from '../util/http-helper';
import { Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private readonly http: HttpClient
  ) { }

  private uploadedArtifactSubject = new Subject<number>();
  uploadedArtifactId$ = this.uploadedArtifactSubject.asObservable();

  submit(submission: Submission): Observable<Submission> {
    return this.http.post<SubmissionJSON>(constructBackendRequest(Endpoints.SUBMISSION), submission)
      .pipe(map((s) => new Submission(s)));
  }

  deleteArtifact(artifactId: number): Observable<string> {
    return this.http.delete<string>(constructBackendRequest(`${Endpoints.ARTIFACT}${artifactId}`));
  }

  uploadArtifact(url: string, formData: FormData) {
    return this.http.post<number>(url, formData);
  }
}
