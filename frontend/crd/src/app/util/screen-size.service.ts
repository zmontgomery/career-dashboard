import {Injectable} from "@angular/core";
import {debounceTime, fromEvent, map, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {

  /**
   * Start off with the initial value use the isMobile$ | async in the view to get both the
   * original value and the new value after resize.
   */
  isMobile$: Observable<boolean>;

  /**
   * Start off with the initial value use the screenSize$ | async in the view to get both the
   * original value and the new value after resize.
   */
  screenSize$: Observable<number>;

  constructor() {
    // Grabs the screen size
    const grabScreenSize = () => document.body.offsetWidth;

    // Checks if screen size is less than 700 pixels
    const checkScreenSize = (size: number) => size < 700;

    // Create observable from window resize event throttled so only fires every 500ms
    // Start off with the initial value use the isScreenSmall$ | async in the
    // view to get both the original value and the new value after resize.
    this.screenSize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .pipe(map(grabScreenSize))

    this.isMobile$ = this.screenSize$.pipe(map(checkScreenSize))
  }
}
