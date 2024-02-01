import { YearLevel } from "./Milestone";

export interface TaskJSON {
  name: string;
  description: string;
  needsArtifact?: boolean;
  taskID: number;
  isRequired: boolean;
  submission: any;
  yearLevel: YearLevel;
  milestoneID: number;
  taskType: string;
  artifactName?: string;
  eventID?: number;
}

export class Task {
  constructor(json: TaskJSON) {
    this.name = json.name;
    this.description = json.description;
    this.needsArtifact = json.needsArtifact;
    this.taskID = json.taskID;
    this.isRequired = json.isRequired;
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = true;
    // TODO replace with constructor call when we add submission objects
    this.submission = json.submission;
    this.yearLevel = json.yearLevel;
    this.milestoneID = json.milestoneID;
    this.taskType = json.taskType;
    this.artifactName = json?.artifactName;
    this.eventID = json?.eventID;
  }

  name: string;
  description: string;
  needsArtifact?: boolean;
  taskID: number;
  isRequired: boolean;
  isComplete: boolean;
  submission: any;
  yearLevel: YearLevel;
  milestoneID: number;
  taskType: string;
  artifactName?: string;
  eventID?: number;
}
