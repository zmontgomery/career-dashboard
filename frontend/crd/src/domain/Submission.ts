export interface SubmissionJSON {
  submissionID: number;
  artifactID: number;
  taskID: number;
  studentID: number;
  submissionDate: Date;
}

export class Submission {
  constructor(json: SubmissionJSON) {
    this.artifactID = json.artifactID;
    this.submissionID = json.submissionID;
    this.artifactID = json.artifactID;
    this.taskID = json.taskID;
    this.studentID = json.studentID;
    this.submissionDate = json.submissionDate;
  }

  submissionID: number;
  artifactID: number;
  taskID: number;
  studentID: number;
  submissionDate: Date;
}
