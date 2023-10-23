import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export const root = '/api'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  get(path: string, options: any): Observable<any> {
    return this.http.get(this.constructPath(path), options);
  }

  post(path: string, body: any, options: any): Observable<any> {
    return this.http.post(this.constructPath(path), body, options);
  }

  patch(path: string, body: any, options: any): Observable<any> {
    return this.http.patch(this.constructPath(path), body, options);
  }

  delete(path: string, options: any): Observable<any> {
    return this.http.delete(this.constructPath(path), options);
  }

  //
  // Private
  //

  private constructPath(path: string): string {
    return `${root}/${path}`;
  }  
}
