export interface DegreeProgramJSON{
    id: string;
    degreeName: string;
    isMinor: boolean;
}

export class DegreeProgram{
    constructor(json: DegreeProgramJSON){
        this.id = json.id;
        this.degreeName = json.degreeName;
        this.isMinor = json.isMinor;
    }

    id: string;
    degreeName: string;
    isMinor: boolean;
}