import {User, UserJSON} from "../security/domain/user";

export interface UsersSearchResponseJSON {
  readonly totalResults: number;
  readonly users: Array<UserJSON>;
}

export class UsersSearchResponse {
  readonly totalResults: number;
  readonly users: Array<User>;

  constructor(json: UsersSearchResponseJSON) {
    this.totalResults = json.totalResults;
    this.users = json.users.map(it => new User(it));
  }
}
