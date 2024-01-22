export interface ArtifactJSON {
  name: string;
  id: number;
  comment: string;
}

export class Artifact {
  constructor(json: ArtifactJSON) {
    this.name = json.name
    this.id = json.id;
    this.comment = json.comment;
  }

  name: string;
  id: number;
  comment: string;
}
