import { Component } from '@angular/core';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.less']
})
export class UsersPageComponent {

  // placeholder profile pic site
  profilePicURLBase = 'https://i.pravatar.cc/';

  displayedColumns: string[] = ['picture', 'name', 'email', 'buttons'];
  dataSource = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      id: '250',
    },
    {
      name: 'Alice Smith',
      email: 'alice@example.com',
      id: '251',
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      id: '252',
    }
  ];
}


