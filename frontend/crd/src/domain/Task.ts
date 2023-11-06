export interface TaskJSON {
  description: string;
  needsArtifact: boolean;
  id: string;
  isRequired: boolean;
}

export class Task {
  constructor(json: TaskJSON) {
    this.description = json.description;
    this.needsArtifact = json.needsArtifact;
    this.id = json.id;
    this.isRequired = json.isRequired;
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = true;
  }

  description: string;
  needsArtifact: boolean;
  id: string;
  isRequired: boolean;
  isComplete: boolean;
}
