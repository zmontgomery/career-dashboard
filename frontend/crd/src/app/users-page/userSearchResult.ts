import {User, UserJSON} from "../security/domain/user";

export interface UserSearchResultsJSON {
  readonly totalResults: number;
  readonly users: Array<UserJSON>;
}

export class UserSearchResults {
  readonly totalResults: number;
  readonly users: Array<User>;

  constructor(json: UserSearchResultsJSON) {
    this.totalResults = json.totalResults;
    this.users = json.users.map(it => new User(it));
  }
}
