import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oswego-logo',
  templateUrl: './oswego-logo.component.html',
  styleUrls: ['./oswego-logo.component.less']
})
export class OswegoLogoComponent {

  @Input()
  sizeFactor = 1;

  @Input()
  iconPosition: 'vertical' | 'horizontal' = 'horizontal';

  @Input()
  color: 'green' | 'black' | 'white' = 'green';

  constructor(private readonly router: Router) {

  }

  get imageStr() {
    return `assets/images/Oswego_logo_${this.iconPosition}_${this.color}.png`;
  }

  onClick() {
    this.router.navigate(['']);
  }

  get width() { return 600 * this.sizeFactor }
  get height() { return 210 * this.sizeFactor }

}
