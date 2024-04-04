import { Component } from '@angular/core';
import {ScreenSizeService} from "./util/screen-size.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'crd';

  noNavBar = ['login', 'signup'];
  showAIButton$: Observable<boolean>;
  showAIInMenu$: Observable<boolean>;
  showTitle$: Observable<boolean>;

  constructor(
    screenSizeSvc: ScreenSizeService
  ) {
    this.showAIButton$ = screenSizeSvc.screenSize$.pipe(map(it => it > 770));
    this.showAIInMenu$ = this.showAIButton$.pipe(map(it => !it));
    this.showTitle$ = screenSizeSvc.screenSize$.pipe(map(it => it > 430));
  }

  needsNavBar(): boolean {
    return this.noNavBar.every((uri) => {
      return !location.href.includes(uri);
    });
  }
}
