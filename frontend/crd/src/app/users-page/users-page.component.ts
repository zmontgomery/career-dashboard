import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../security/domain/user";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {UserSearchResultsJSON} from "./userSearchResult";
import {PageEvent} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {ScreenSizeService} from "../util/screen-size.service";


@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.less']
})
export class UsersPageComponent implements OnInit {

  // placeholder profile pic site
  profilePicURLBase = 'https://i.pravatar.cc/';

  mobileColumns: string[] = ['picture', 'name', 'buttons'];
  desktopColumns: string[] = ['picture', 'name', 'email', 'buttons'];
  // displayedColumns: string[] = this.mobileColumns;

  dataSource: Array<User>  = [];

  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';
  isMobile$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private screenSizeSvc: ScreenSizeService,
  ) {
    this.isMobile$ = this.screenSizeSvc.isMobile$;
  }

  ngOnInit(): void {
    this.loadData();
  }

  // Method to fetch data from API
  loadData(): void {
    const apiUrl = constructBackendRequest(Endpoints.USERS_SEARCH,
      {key:'pageOffset', value: this.currentPage},
      {key:'pageSize', value: this.pageSize},
      {key: 'searchTerm', value: this.searchTerm}
      );
    this.http.get<UserSearchResultsJSON>(apiUrl).subscribe((searchResults: UserSearchResultsJSON) => {
      this.dataSource = searchResults.users.map(it => new User(
        // change id to "random" number for now to support random profile pics
        {...it, id: '250' + it.email.match(/\d+/g)}
      ));
      this.totalItems = searchResults.totalResults;
    });
  }

  // Method to handle page change
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex; // pageIndex starts from 0
    this.pageSize = event.pageSize;
    this.loadData();
  }

  // Method to handle search
  onSearch(): void {
    this.currentPage = 0; // Reset to first page when searching
    this.loadData();
  }
}


