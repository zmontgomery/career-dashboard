import { TempUser, TempUserJSON } from "./user";

export interface LoginResponseJSON {
    readonly token: string;
    readonly user: TempUserJSON;
}

export interface LoginRequestJSON {
    readonly idToken: string;
    readonly tokenType: string;
} 

export enum TokenType {
    GOOGLE = 'GOOGLE',
    MICROSOFT_ENTRA_ID = 'MICROSOFT_ENTRA_ID'
}

export class LoginResponse {
    readonly token: string;
    readonly user: TempUser;

    constructor(json: LoginResponseJSON) {
        this.token = json.token;
        this.user = new TempUser(json.user);
    }
}

export class LoginRequest {
    readonly idToken: string;
    readonly tokenType: TokenType;

    constructor(json: LoginRequestJSON) {
        this.idToken = json.idToken;
        this.tokenType = this.determineTokenType(json.tokenType);
    }

    //
    // Private
    //

    private determineTokenType(tokenType: string): TokenType {
        switch(tokenType) {
            case 'GOOGLE': return TokenType.GOOGLE
            case 'MICROSOFT_ENTRA_ID': return TokenType.MICROSOFT_ENTRA_ID
            default: throw Error('token type is unknown')
        }
    }
}

export class Token {
    private refreshing: boolean;
  
    constructor(
      private token: string,
      private tokenIssued: Date,
    ) {
      this.refreshing = false;
    }
  
    getToken() {
      return this.token;
    }
  
    getExpiry() {
      return this.tokenIssued;
    }
  
    willExpire(): boolean {
      return Date.now() >= this.tokenIssued!.getTime() + (20 * 60 * 1000);
    }
  
    expired(): boolean {
      return Date.now() >= this.tokenIssued!.getTime() + (60 * 60 * 1000);
    }
  
    refresh() {
      this.refreshing = true;
    }
  
    isRefreshing(): boolean {
      return this.refreshing;
    }
  }