export interface SubmissionJSON {
  id: number;
  artifactId: number;
  taskId: number;
  studentId: string;
  submissionDate: Date;
}

export class Submission {
  constructor(json: SubmissionJSON) {
    this.submissionId = json.id;
    this.artifactId = json.artifactId;
    this.taskId = json.taskId;
    this.studentId = json.studentId;
    this.submissionDate = new Date(json.submissionDate);
  }

  static make(
    artifactId: number,
    taskId: number,
    studentId: string,
    submissionDate: Date
  ): Submission {
    return new Submission({
      id: 0,
      artifactId,
      taskId,
      studentId,
      submissionDate
    });
  }

  submissionId: number;
  artifactId: number;
  taskId: number;
  studentId: string;
  submissionDate: Date;
}
