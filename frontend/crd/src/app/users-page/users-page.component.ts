import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User, UserJSON} from "../security/domain/user";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {UserSearchResultsJSON} from "./userSearchResult";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.less']
})
export class UsersPageComponent implements OnInit {

  // placeholder profile pic site
  profilePicURLBase = 'https://i.pravatar.cc/';

  displayedColumns: string[] = ['picture', 'name', 'email', 'buttons'];

  dataSource: Array<User>  = [];

  currentPage: number = 0;
  pageSize: number = 5;
  totalItems: number = 12;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  // Method to fetch data from API
  loadData(): void {
    const apiUrl = constructBackendRequest(Endpoints.USERS,
      {key:'page', value: this.currentPage},
      {key:'pageSize', value: this.pageSize},
      {key: 'search', value: this.searchTerm}
      );
    // this.http.get<UserSearchResultsJSON>(apiUrl).subscribe((searchResults: UserSearchResultsJSON) => {
    //   // this.dataSource = searchResults.users.map(it => new User(it))
    //   // this.totalItems = searchResults.totalResults;
    // });
    this.http.get<UserJSON[]>(apiUrl).subscribe((searchResults: UserJSON[]) => {
      const start = (this.currentPage) * this.pageSize
      const end = start + this.pageSize
      this.dataSource = searchResults.slice(start, end).map(user => new User(
        // just get "random" number
        {...user, id: '250' + searchResults.findIndex(it => it.id == user.id)}
      ));
      this.totalItems = searchResults.length;
      });
  }

  // Method to handle page change
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex; // pageIndex starts from 0
    this.loadData();
  }

  // Method to handle search
  onSearch(): void {
    this.currentPage = 0; // Reset to first page when searching
    this.loadData();
  }
}


