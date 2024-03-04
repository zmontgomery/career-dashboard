import { LangUtils } from "src/app/util/lang-utils";
import { StudentDetails, StudentDetailsJSON } from "src/domain/StudentDetails";

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
    readonly canEmail: boolean;
    readonly canText: boolean;
    readonly studentDetails?: StudentDetailsJSON;
    readonly role: Role;
    readonly profilePictureId: number;
}

/**
 * A user
 */
export class User {
    readonly id: string;
    readonly email: string;
    readonly phoneNumber: string;
    readonly dateCreated: Date;
    readonly lastLogin: Date;
    readonly firstName: string;
    readonly lastName: string;
    readonly preferredName: string;
    readonly fullName: string;
    readonly canEmail: boolean;
    readonly canText: boolean;
    readonly studentDetails?: StudentDetails
    readonly role: Role;
    readonly profilePictureId: number;
    profilePictureURL: string | null = null;

    constructor(json: UserJSON) {
        this.id = json.id;
        this.email = json.email;
        this.phoneNumber = json.phoneNumber;
        this.dateCreated = new Date(json.dateCreated);
        this.lastLogin = new Date(json.lastLogin);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.preferredName = json.preferredName;
        this.canEmail = json.canEmail;
        this.canText = json.canText;
        if (LangUtils.exists(json.studentDetails)) {
            this.studentDetails = new StudentDetails(json.studentDetails!)
        }
        this.role = json.role;
        this.fullName = this.firstName + " " + this.lastName;
        this.profilePictureId = json.profilePictureId;
    }

    static makeEmpty() {
        return new User({
            id: '',
            email: '',
            firstName: 'No',
            lastName: 'User',
            preferredName: 'No',
            phoneNumber: '0000000000',
            dateCreated: 0,
            lastLogin: 0,
            canEmail: false,
            canText: false,
            role: Role.Student,
            profilePictureId: 0,
        });
    }

    hasFacultyPrivileges(): boolean {
      return this.role == Role.Faculty || this.hasAdminPrivileges();
    }

    hasAdminPrivileges(): boolean {
      return this.role == Role.Admin || this.hasSuperAdminPrivileges();
    }

    hasSuperAdminPrivileges(): boolean {
      return this.role == Role.SuperAdmin;
    }
}

export enum Role {
  Student = 'Student',
  Faculty = 'Faculty',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin'
}
