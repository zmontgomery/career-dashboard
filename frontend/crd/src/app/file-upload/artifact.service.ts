import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import {Artifact, ArtifactJSON} from "../../domain/Artifact";

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {

  constructor(
    private http: HttpClient,
  ) {
  }

  // Get all data items
  allArtifacts(): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(constructBackendRequest(Endpoints.ARTIFACT))
      .pipe(map((data: any) => {
        return data.map((artifactData: ArtifactJSON) => {
          return new Artifact(artifactData)
        })
      }))
  }

  deleteArtifact(artifactId: number): Observable<string> {
    return this.http.delete<string>(constructBackendRequest(`${Endpoints.ARTIFACT}${artifactId}`));
  }

  uploadArtifact(formData: FormData): Observable<number> {
    return this.http.post<number>(constructBackendRequest(Endpoints.ARTIFACT), formData);
  }

  /**
   * Retrieve the file that the artifact is linked to
   */
  getArtifactFile(id: number): Observable<Blob> {
    return this.http.get(constructBackendRequest(`${Endpoints.ARTIFACT_FILE}/${id}`), { responseType: 'blob' })
      .pipe(map((data: any) => {
        return new Blob([data], { type: 'application/pdf' });
      }));
  }
}
