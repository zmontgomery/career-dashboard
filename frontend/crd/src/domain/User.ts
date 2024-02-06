export interface UserJSON{
    id: String;
	email: String;
    phoneNumber: String;
	dateCreated: Date;
    lastLogin: Date;
	firstName: String;
	lastName: String;
	canEmail: boolean;
	canText: boolean;
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
        this.canEmail = json.canEmail;
        this.canText = json.canText;
    }

    id: String;
	email: String;
    phoneNumber: String;
	dateCreated: Date;
    lastLogin: Date;
	firstName: String;
	lastName: String;
	canEmail: boolean;
	canText: boolean;
}