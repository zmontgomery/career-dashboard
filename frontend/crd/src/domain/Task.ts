import { YearLevel } from "./Milestone";

export interface TaskJSON {
  name: string;
  description: string;
  needsArtifact?: boolean;
  id: number;
  isRequired: boolean;
  yearLevel: YearLevel;
  milestoneID: number;
  taskType: string;
  artifactName?: string;
  eventID?: number;
  submissionInstructions?: string;
}

export class Task {
  constructor(json: TaskJSON) {
    this.name = json.name;
    this.description = json.description;
    this.needsArtifact = json.needsArtifact;
    this.taskID = json.id;
    this.isRequired = json.isRequired;
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = true;
    this.yearLevel = json.yearLevel;
    this.milestoneID = json.milestoneID;
    this.taskType = json.taskType;
    this.artifactName = json?.artifactName;
    this.eventID = json?.eventID;
    this.submissionInstructions = json?.submissionInstructions;
  }

  name: string;
  description: string;
  needsArtifact?: boolean;
  taskID: number;
  isRequired: boolean;
  isComplete: boolean;
  yearLevel: YearLevel;
  milestoneID: number;
  taskType: string;
  artifactName?: string;
  eventID?: number;
  submissionInstructions?: string;
}
