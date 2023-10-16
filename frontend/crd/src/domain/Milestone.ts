export interface MilestoneJSON {
  activityID: string;
  description: string;
  needsArtifact: Boolean;
  date: string;
  milestoneID: string;
  active: Boolean;
}

export class Milestone {
  constructor(json: MilestoneJSON) {
    this.activityID = json.activityID;
    this.description = json.description;
    this.needsArtifact = json.needsArtifact;
    this.date = new Date(json.date);
    this.milestoneID = json.milestoneID;
    this.active = json.active;
  }

  activityID: string;
  description: string;
  needsArtifact: Boolean;
  date: Date;
  milestoneID: string;
  active: Boolean;
}
