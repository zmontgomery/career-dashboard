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
        this.startDate = json.startDate;
        this.endDate = json.endDate;
    }

    id: string;
    clubName: string;
    startDate: Date;
    endDate: Date;
}