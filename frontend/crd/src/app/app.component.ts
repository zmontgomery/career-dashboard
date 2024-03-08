import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'crd';

  noNavBar = ['login', 'signup'];

  constructor() {}

  needsNavBar(): boolean {
    return this.noNavBar.every((uri) => {
      return !location.href.includes(uri);
    });
  }
}
