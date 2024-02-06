export interface SubmissionJSON {
  id: number;
  artifactID: number;
  taskID: number;
  studentID: number;
  submissionDate: Date;
}

export class Submission {
  constructor(json: SubmissionJSON) {
    this.submissionID = json.id;
    this.artifactID = json.artifactID;
    this.taskID = json.taskID;
    this.studentID = json.studentID;
    this.submissionDate = new Date(json.submissionDate);
  }

  submissionID: number;
  artifactID: number;
  taskID: number;
  studentID: number;
  submissionDate: Date;
}
