import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-oswego-logo',
  templateUrl: './oswego-logo.component.html',
  styleUrls: ['./oswego-logo.component.less']
})
export class OswegoLogoComponent {

  @Input()
  sizeFactor = 1;

  get width() { return 600 * this.sizeFactor }
  get height() { return 210 * this.sizeFactor }
}
