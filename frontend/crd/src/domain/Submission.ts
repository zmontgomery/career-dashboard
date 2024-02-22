export interface SubmissionJSON {
  id: number;
  artifactId: number;
  taskId: number;
  studentId: string;
  submissionDate: Date;
  comment: string;
}

export class Submission {
  constructor(json: SubmissionJSON) {
    this.submissionId = json.id;
    this.artifactId = json.artifactId;
    this.taskId = json.taskId;
    this.studentId = json.studentId;
    this.submissionDate = new Date(json.submissionDate);
    this.comment = json.comment;
  }

  static make(
    artifactId: number,
    taskId: number,
    studentId: string,
    submissionDate: Date,
    comment: string
  ): Submission {
    return new Submission({
      id: 0,
      artifactId,
      taskId,
      studentId,
      submissionDate,
      comment
    });
  }

  submissionId: number;
  artifactId: number;
  taskId: number;
  studentId: string;
  submissionDate: Date;
  comment: string;
}
