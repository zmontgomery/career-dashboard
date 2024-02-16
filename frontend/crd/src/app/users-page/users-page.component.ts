import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../security/domain/user";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.less']
})
export class UsersPageComponent implements OnInit {

  // placeholder profile pic site
  profilePicURLBase = 'https://i.pravatar.cc/';

  displayedColumns: string[] = ['picture', 'name', 'email', 'buttons'];
  fakeDataSource = [
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
    },
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
    },
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
    },
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
    },
  ];

  dataSource: Array<User>  = [];

  currentPage: number = 1;
  pageSize: number = 5; // Adjust the page size as needed
  totalItems: number = 12;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  // Method to fetch data from API
  loadData(): void {
    const apiUrl = `https://api.example.com/data?page=${this.currentPage}&pageSize=${this.pageSize}`;
    // this.http.get<any[]>(apiUrl).subscribe((data: any) => {
    //   // Update totalItems based on API response
    //   this.totalItems = data?.totalItems; // Adjust this based on your API response structure
    // });
    const start = (this.currentPage - 1) * this.pageSize
    const end = start + this.pageSize
    this.dataSource = this.fakeDataSource.slice(start, end).map((userData) => {
      return new User({
        firstName: userData.name, email: userData.email, id: userData.id,
        phoneNumber: "", dateCreated: 1, lastLogin: 1,
        lastName: "", canEmail: true, canText: true, student: true, admin: false, faculty: false,
      });
    })
  }

  // Method to handle page change
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; // pageIndex starts from 0
    this.loadData();
  }
}


