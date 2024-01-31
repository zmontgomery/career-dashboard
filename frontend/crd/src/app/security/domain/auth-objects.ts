import { User, UserJSON } from "./user";

/**
 * Login Response Json
 * 
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
export interface LoginResponseJSON {
    readonly token: string;
    readonly user: UserJSON;
}

/**
 * Login Request Json
 * 
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
export interface LoginRequestJSON {
    readonly idToken: string;
    readonly tokenType: string;
} 

/**
 * Enum for the possible token types
 */
export enum TokenType {
    GOOGLE = 'GOOGLE',
    MICROSOFT_ENTRA_ID = 'MICROSOFT_ENTRA_ID'
}

/**
 * Login Response containing a token and a user
 * 
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
export class LoginResponse {
    readonly token: string;
    readonly user: User;

    constructor(json: LoginResponseJSON) {
        this.token = json.token;
        this.user = new User(json.user);
    }
}

/**
 * Login Request sent to the backend
 * 
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
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

    /**
     * Determines the type of the token based on the enum balue
     * 
     * @param tokenType Type of the token
     * @returns the token type
     */
    private determineTokenType(tokenType: string): TokenType {
        switch(tokenType) {
            case 'GOOGLE': return TokenType.GOOGLE
            case 'MICROSOFT_ENTRA_ID': return TokenType.MICROSOFT_ENTRA_ID
            default: throw Error('token type is unknown')
        }
    }
}

/**
 * A JWT token used for authentication
 * 
 * @author Jimmy Logan <jrl9984@rit.edu>
 */
export class Token {
    private refreshing: boolean;
  
    constructor(
      private token: string,
      private tokenIssued: Date,
    ) {
      this.refreshing = false;
    }
  
    /**
     * @returns if the token is in the refresh range of 20 minutes 
     */
    willExpire(): boolean {
      return Date.now() >= this.tokenIssued!.getTime() + (40 * 60 * 1000);
    }
  
    /**
     * @returns if the token is expired
     */
    expired(): boolean {
      return Date.now() >= this.tokenIssued!.getTime() + (60 * 60 * 1000);
    }
  
    /**
     * Sets the token to refreshing
     */
    refresh() {
      this.refreshing = true;
    }

    /**
     * @returns the token
     */
    getToken() {
      return this.token;
    }
  
    /**
     * @returns when the token was issued
     */
    getExpiry() {
      return this.tokenIssued;
    }
  
    /**
     * @returns if the token is currently being refreshed
     */
    isRefreshing(): boolean {
      return this.refreshing;
    }
  }