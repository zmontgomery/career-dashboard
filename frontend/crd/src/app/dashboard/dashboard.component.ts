import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent{
  linkList = [
         { label: 'Task 1', url: 'https://www.google.com/' },
         { label: 'Task 2', url: 'https://angular.io' },
         { label: 'Task 3', url: 'https://github.com' },
       ];
}
