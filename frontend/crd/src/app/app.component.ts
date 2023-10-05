import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'crd';
  posts: any[] = [];

  constructor(
    private readonly http: HttpClient,
  ) {}

  makeRequest() {
    return this.http.get<any[]>('http://localhost:8080/api/posts').subscribe((res: any[]) => {
      this.posts = res;
    });
  }
}
