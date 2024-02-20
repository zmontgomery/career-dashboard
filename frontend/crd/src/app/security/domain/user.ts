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
    readonly canEmail: boolean;
    readonly canText: boolean;
    readonly role: Role;
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
    readonly fullName: string;
    readonly canEmail: boolean;
    readonly canText: boolean;
    readonly role: Role;

    constructor(json: UserJSON) {
        this.id = json.id;
        this.email = json.email;
        this.phoneNumber = json.phoneNumber;
        this.dateCreated = new Date(json.dateCreated);
        this.lastLogin = new Date(json.lastLogin);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.canEmail = json.canEmail;
        this.canText = json.canText;
        this.role = json.role;
        this.fullName = this.firstName + " " + this.lastName;
    }

    static makeEmpty() {
        return new User({
            id: '',
            email: '',
            firstName: 'No',
            lastName: 'User',
            phoneNumber: '0000000000',
            dateCreated: 0,
            lastLogin: 0,
            canEmail: false,
            canText: false,
            role: Role.Student
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

enum Role {
  Student = 'Student',
  Faculty = 'Faculty',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin'
}
