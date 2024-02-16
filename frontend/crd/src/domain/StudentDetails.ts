import { Job, JobJSON } from "./Job";
import { YearLevel } from "./Milestone";
import { Project, ProjectJSON } from "./Project";
import { Skill, SkillJSON } from "./Skill";

export interface StudentDetailsJSON{
    id: string;
    universityId: string;
    gpa: number;
    description: string;
    graduationYear: Date;
    startDate: Date;
    yearLevel: YearLevel;
    projects: Array<ProjectJSON>;
    skills: Array<SkillJSON>;
    jobs: Array<JobJSON>;
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
        this.projects = json.projects?.map((project) => new Project(project));
        this.skills = json.skills?.map((skill) => new Skill(skill));
        this.jobs = json.jobs?.map((job) => new Job(job));
    }

    id: string;
    universityId: string;
    gpa: number;
    description: string;
    graduationYear: Date;
    startDate: Date;
    yearLevel: YearLevel;
    projects: Array<Project>;
    skills: Array<Skill>;
    jobs: Array<Job>;

    static makeEmpty(){
        return new StudentDetails({
            id: '', 
            universityId: '', 
            gpa: 0.000, 
            description: '', 
            graduationYear: new Date(), 
            startDate: new Date(), 
            yearLevel: YearLevel.Freshman,
            projects: [],
            skills: [],
            jobs: []
        });
    }
}