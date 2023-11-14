export interface TempUserJSON {
    readonly oid: string;
    readonly name: string;
    readonly email: string;
    readonly role: string;
}

export class TempUser {
    readonly oid: string;
    readonly name: string;
    readonly email: string;
    readonly role: string;

    constructor(json: TempUserJSON) {
        this.oid = json.oid;
        this.name = json.name;
        this.email = json.email;
        this.role = json.role;
    }
}