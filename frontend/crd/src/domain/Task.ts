export interface TaskJSON {
    description: string;
    needsArtifact: Boolean;
    id: string;
    isRequired: Boolean;
}

export class Task {
    constructor(json: TaskJSON) {
        this.description = json.description;
        this.needsArtifact = json.needsArtifact;
        this.id = json.id;
        this.isRequired = json.isRequired;
    }

    description: string;
    needsArtifact: Boolean;
    id: string;
    isRequired: Boolean;
    expanded = false;
}
