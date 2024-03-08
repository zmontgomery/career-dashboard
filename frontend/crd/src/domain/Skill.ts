export interface SkillJSON{
    id: string;
    name: string;
    language: boolean;
    studentDetailsID: string;
}

export class Skill{

    constructor(json: SkillJSON){
        this.id = json.id;
        this.name = json.name;
        this.isLanguage = json.language;
        this.studentDetailsID = json.studentDetailsID;
    }

    id: string;
    name: string;
    isLanguage: boolean;
    studentDetailsID: string;

    static makeEmpty(){
        return new Skill({
            id: '',
            name: '',
            language: false,
            studentDetailsID: ''
        })
    }
}