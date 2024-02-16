export interface ProjectJSON{
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    studentDetailsID: string;
}

export class Project{
    constructor(json: ProjectJSON){
        this.id = json.id;
        this.name = json.name;
        this.description = json.description;
        this.startDate = json.startDate;
        this.endDate = json.endDate;
        this.studentDetailsID = json.studentDetailsID;
    }

    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    studentDetailsID: string;

    static makeEmpty(){
        return new Project({
            id: '',
            name: '',
            description: '',
            startDate: new Date(),
            endDate: new Date(),
            studentDetailsID: ''
        })
    }
}