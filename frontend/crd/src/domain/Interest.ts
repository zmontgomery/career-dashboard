export interface InterestJSON{
    id: string;
    name: string;
    studentDetailsID: string;
}

export class Interest{

    constructor(json: InterestJSON){
        this.id = json.id;
        this.name = json.name;
        this.studentDetailsID = json.studentDetailsID;
    }

    id: string;
    name: string;
    studentDetailsID: string;

    static makeEmpty(){
        return new Interest({
            id: '',
            name: '',
            studentDetailsID: ''
        });
    }
}