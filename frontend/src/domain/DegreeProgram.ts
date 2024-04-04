export interface DegreeProgramJSON{
    id: string;
    name: string;
    minor: boolean;
    studentDetailsID: string;
}

export class DegreeProgram{
    constructor(json: DegreeProgramJSON){
        this.id = json.id;
        this.name = json.name;
        this.isMinor = json.minor;
        this.studentDetailsID = json.studentDetailsID;
    }

    id: string;
    name: string;
    isMinor: boolean;
    studentDetailsID: string;

    static makeEmpty(){
        return new DegreeProgram({
            id: '',
            name: '',
            minor: false,
            studentDetailsID: ''
        })
    }
}