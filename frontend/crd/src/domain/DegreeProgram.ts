export interface DegreeProgramJSON{
    id: string;
    name: string;
    isMinor: boolean;
    studentDetailsID: string;
}

export class DegreeProgram{
    constructor(json: DegreeProgramJSON){
        this.id = json.id;
        this.name = json.name;
        this.isMinor = json.isMinor;
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
            isMinor: false,
            studentDetailsID: ''
        })
    }
}