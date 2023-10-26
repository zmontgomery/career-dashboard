import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'crd';
  posts: any[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly authService: MsalService,
    private readonly broadcastService: MsalBroadcastService,
  ) {}


  ngOnInit(): void {
    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
      });
  }

  makeRequest() {
    return this.http.get<any[]>('http://localhost:8080/api/posts').subscribe((res: any[]) => {
      this.posts = res;
    });
  }

  login() {
    // Note the scope is set since we are using the access tokens for personal use
    // https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/521#issuecomment-577400515
    this.authService.loginRedirect({scopes: [`${environment.clientId}/.default`]});
  }
}
