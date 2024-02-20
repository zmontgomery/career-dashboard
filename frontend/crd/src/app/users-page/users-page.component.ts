import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Role, User} from "../security/domain/user";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {UsersSearchResponseJSON} from "./userSearchResult";
import {PageEvent} from "@angular/material/paginator";
import {debounceTime, first, map, Observable, of, Subject} from "rxjs";
import {ScreenSizeService} from "../util/screen-size.service";
import {AuthService} from "../security/auth.service";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.less']
})
export class UsersPageComponent implements OnInit, OnDestroy {

  // placeholder profile pic site
  profilePicURLBase = 'https://i.pravatar.cc/';

  mobileColumns: string[] = ['picture', 'name', 'buttons'];
  desktopColumns: string[] = ['picture', 'name', 'email', 'role', 'buttons'];
  // displayedColumns: string[] = this.mobileColumns;

  dataSource: Array<User>  = [];

  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';
  private searching$ = new Subject<void>();
  isMobile$: Observable<boolean>;

  user$: Observable<User | null>

  constructor(
    private http: HttpClient,
    private screenSizeSvc: ScreenSizeService,
    private readonly authService: AuthService
  ) {
    this.isMobile$ = this.screenSizeSvc.isMobile$;
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.pageSize = Number(localStorage.getItem('pageSize') ?? 10);
    this.loadData();
    this.searching$.pipe(
      debounceTime(500), // Debounce for 1 second
    )
      .subscribe(() => {
          this.currentPage = 0; // Reset to first page when searching
          this.loadData();
      });
  }

  ngOnDestroy() {
    this.searching$.complete()
  }

  // Method to fetch data from API
  loadData(): void {
    const apiUrl = constructBackendRequest(Endpoints.USERS_SEARCH,
      {key:'pageOffset', value: this.currentPage},
      {key:'pageSize', value: this.pageSize},
      {key: 'searchTerm', value: this.searchTerm}
      );
    this.http.get<UsersSearchResponseJSON>(apiUrl).subscribe((searchResults: UsersSearchResponseJSON) => {
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
    localStorage.setItem('pageSize', this.pageSize.toString())
    this.loadData();
  }

  // Method to handle search
  onSearch(): void {
    this.searching$.next();
  }

  protected readonly Role = Role;
}


