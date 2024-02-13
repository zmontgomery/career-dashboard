export interface SkillJSON{
    id: string;
    skillName: string;
    isLanguage: boolean;
}

export class Skill{
    constructor(json: SkillJSON){
        this.id = json.id;
        this.skillName = json.skillName;
        this.isLanguage = json.isLanguage;
    }
    id: string;
    skillName: string;
    isLanguage: boolean;
}