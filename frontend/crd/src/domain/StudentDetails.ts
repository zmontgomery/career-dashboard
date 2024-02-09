import { YearLevel } from "./Milestone";

export interface StudentDetailsJSON{
    id: string;
    universityId: string;
    gpa: number;
    description: string;
    graduationYear: Date;
    startDate: Date;
    degreeLevel: string;
}

export class StudentDetails{
    constructor(json: StudentDetailsJSON){
        this.id = json.id;
        this.universityId = json.universityId;
        this.gpa = json.gpa;
        this.description = json.description;
        this.graduationYear = json.graduationYear;
        this.startDate = json.startDate;
        this.degreeLevel = json.degreeLevel;
    }

    id: string;
    universityId: string;
    gpa: number;
    description: string;
    graduationYear: Date;
    startDate: Date;
    degreeLevel: string;
}