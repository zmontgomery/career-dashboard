export interface ClubJSON{
    id: string;
    clubName: string;
    startDate: Date;
    endDate: Date;
}

export class Club{
    constructor(json: ClubJSON){
        this.id = json.id;
        this.clubName = json.clubName;
        this.startDate = new Date(json.startDate);
        this.endDate = new Date(json.endDate);
    }

    id: string;
    clubName: string;
    startDate: Date;
    endDate: Date;
}