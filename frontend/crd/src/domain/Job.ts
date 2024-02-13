export interface JobJSON{
    id: string;
    jobName: string;
    location: string;
    description: string;
    startDate: Date;
    endDate: Date
    isCoop: boolean;
}

export class Job{
    constructor(json: JobJSON){
        this.id = json.id;
        this.jobName = json.jobName;
        this.location = json.location;
        this.description = json.description;
        this.startDate = json.startDate;
        this.endDate = json.endDate;
        this.isCoop = json.isCoop;
    }

    id: string;
    jobName: string;
    location: string;
    description: string;
    startDate: Date;
    endDate: Date
    isCoop: boolean;
}