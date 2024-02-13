import { YearLevel } from "src/domain/Milestone";
import { StudentDetails } from "src/domain/StudentDetails";

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
    readonly studentDetails: StudentDetails;
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
    readonly canEmail: boolean;
    readonly canText: boolean;
    readonly studentDetails: StudentDetails;

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
        this.studentDetails = json.studentDetails;
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
            studentDetails: new StudentDetails({id: '', universityId: '', gpa: 0.000, description: '', graduationYear: new Date(), startDate: new Date(), yearLevel: YearLevel.Freshman})
        });
    }
}