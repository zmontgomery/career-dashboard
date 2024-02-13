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
  getPortfolioArtifacts(): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(constructBackendRequest(Endpoints.ARTIFACTS))
      .pipe(map((data: any) => {
        return data.map((artifactData: ArtifactJSON) => {
          return new Artifact(artifactData)
        })
      }))
  }
}
