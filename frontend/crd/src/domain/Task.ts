export interface TaskJSON {
  name: string;
  description: string;
  needsArtifact: boolean;
  id: string;
  isRequired: boolean;
  submission: any;
}

export class Task {
  constructor(json: TaskJSON) {
    this.name = json.name;
    this.description = json.description;
    this.needsArtifact = json.needsArtifact;
    this.id = json.id;
    this.isRequired = json.isRequired;
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = true;
    // TODO replace with constructor call when we add submission objects
    this.submission = json.submission;
  }

  name: string;
  description: string;
  needsArtifact: boolean;
  id: string;
  isRequired: boolean;
  isComplete: boolean;
  submission: any;
}
