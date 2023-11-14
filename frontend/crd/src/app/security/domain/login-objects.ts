import { TempUser, TempUserJSON } from "./user";

export interface LoginResponseJSON {
    readonly sessionID: string;
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
    readonly sessionID: string;
    readonly user: TempUser;

    constructor(json: LoginResponseJSON) {
        this.sessionID = json.sessionID;
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