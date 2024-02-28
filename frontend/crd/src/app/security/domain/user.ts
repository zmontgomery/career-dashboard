import { LangUtils } from "src/app/util/lang-utils";

/**
 * JSON for a user object retrieved from the backend
 */
export interface UserJSON {
    readonly id: string;
    readonly email: string;
    readonly phoneNumber: string;
    readonly dateCreated: number;
    readonly lastLogin: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly preferredName: string;
    readonly signedUp: boolean;
    readonly canEmail: boolean;
    readonly canText: boolean;
    readonly student: boolean;
    readonly admin: boolean;
    readonly faculty: boolean;
}

/**
 * A user
 */
export class User {
    readonly id: string;
    readonly email: string;
    phoneNumber: string;
    readonly dateCreated: Date;
    readonly lastLogin: Date;
    readonly firstName: string;
    readonly lastName: string;
    readonly fullName: string;
    preferredName: string;
    readonly signedUp: boolean;
    canEmail: boolean;
    canText: boolean;
    readonly student: boolean;
    readonly admin: boolean;
    readonly faculty: boolean;

    constructor(json: UserJSON) {
        this.id = json.id;
        this.email = json.email;
        this.phoneNumber = json.phoneNumber;
        this.dateCreated = new Date(json.dateCreated);
        this.lastLogin = new Date(json.lastLogin);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.preferredName = json.preferredName;
        this.signedUp = json.signedUp;
        this.canEmail = json.canEmail;
        this.canText = json.canText;
        this.student = json.student;
        this.admin = json.admin;
        this.faculty = json.faculty;
        this.fullName = this.firstName + " " + this.lastName;
    }

    static makeEmpty() {
        return new User({
            id: '',
            email: '',
            firstName: 'No',
            lastName: 'User',
            preferredName: 'No',
            signedUp: true,
            phoneNumber: '0000000000',
            dateCreated: 0,
            lastLogin: 0,
            canEmail: false,
            canText: false,
            student: true,
            admin: false,
            faculty: false,
        });
    }

    get name() {
        return LangUtils.exists(this.preferredName) ? `${this.preferredName} ${this.lastName}` : `${this.firstName} ${this.lastName}`;
    }
}
