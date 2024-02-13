export interface ProjectJSON{
    id: string;
    projectName: string;
    description: string;
    startDate: Date;
    endDate: Date;
}

export class Project{
    constructor(json: ProjectJSON){
        this.id = json.id;
        this.projectName = json.projectName;
        this.description = json.description;
        this.startDate = json.startDate;
        this.endDate = json.endDate;
    }

    id: string;
    projectName: string;
    description: string;
    startDate: Date;
    endDate: Date;
}