export interface ArtifactJSON {
  artifactID: number;
  fileName: string;
  submissionDate: Date;
  submission: any; // maybe link to submission object?
}

export class Artifact {
  constructor(json: ArtifactJSON) {
    this.artifactID = json.artifactID;
    this.fileName = json.fileName;
    this.submissionDate = json.submissionDate;
    this.submission = json.submission;
  }

  artifactID: number;
  fileName: string;
  submissionDate: Date;
  submission: any; // maybe link to submission object?
}
