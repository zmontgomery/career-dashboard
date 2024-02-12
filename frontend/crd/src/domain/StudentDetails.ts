import { YearLevel } from "./Milestone";

export interface StudentDetailsJSON{
    id: string;
    universityId: string;
    gpa: number;
    description: string;
    graduationYear: Date;
    startDate: Date;
    yearLevel: YearLevel;
}

export class StudentDetails{
    constructor(json: StudentDetailsJSON){
        this.id = json.id;
        this.universityId = json.universityId;
        this.gpa = json.gpa;
        this.description = json.description;
        this.graduationYear = json.graduationYear;
        this.startDate = json.startDate;
        this.yearLevel = json.yearLevel;
    }

    id: string;
    universityId: string;
    gpa: number;
    description: string;
    graduationYear: Date;
    startDate: Date;
    yearLevel: YearLevel;
}