export interface UserJSON{
    id: string;
	email: string;
    phoneNumber: string;
	dateCreated: Date;
    lastLogin: Date;
	firstName: string;
	lastName: string;
	canEmail: boolean;
	canText: boolean;
    isFaculty: boolean;
    isStudent: boolean;
    isAdmin: boolean;
    preferredName: string;
}

export class User{
    constructor(json: UserJSON) {
        this.id = json.id;
        this.email = json.email;
        this.phoneNumber = json.phoneNumber;
        this.dateCreated = json.dateCreated;
        this.lastLogin = json.lastLogin;
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.preferredName = json.preferredName;
        this.canEmail = json.canEmail;
        this.canText = json.canText;
        this.isFaculty = json.isFaculty;
        this.isStudent = json.isStudent;
        this.isAdmin = json.isAdmin;
    }

    id: string;
	email: string;
    phoneNumber: string;
	dateCreated: Date;
    lastLogin: Date;
	firstName: string;
	lastName: string;
	canEmail: boolean;
	canText: boolean;
    isFaculty: boolean;
    isStudent: boolean;
    isAdmin: boolean;
    preferredName: string;
}