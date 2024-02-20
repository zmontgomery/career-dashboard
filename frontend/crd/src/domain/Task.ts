import { YearLevel } from "./Milestone";

export enum TaskType {
  ARTIFACT = 'artifact',
  COMMENT = 'comment',
  EVENT = 'event'
}

export interface TaskJSON {
  name: string;
  description: string;
  id: number;
  isRequired: boolean;
  yearLevel: YearLevel;
  milestoneID: number;
  taskType: TaskType;
  artifactName?: string;
  eventID?: number;
  submissionInstructions?: string;
}

export class Task {
  constructor(json: TaskJSON) {
    this.name = json.name;
    this.description = json.description;
    this.taskID = json.id;
    this.isRequired = json.isRequired;
    this.yearLevel = json.yearLevel;
    this.milestoneID = json.milestoneID;
    this.taskType = json.taskType;
    this.artifactName = json?.artifactName;
    this.eventID = json?.eventID;
    this.submissionInstructions = json?.submissionInstructions;
  }

  name: string;
  description: string;
  taskID: number;
  isRequired: boolean;
  yearLevel: YearLevel;
  milestoneID: number;
  taskType: TaskType;
  artifactName?: string;
  eventID?: number;
  submissionInstructions?: string;

  needsArtifact(): boolean {
    return this.taskType == TaskType.ARTIFACT;
  }
}
