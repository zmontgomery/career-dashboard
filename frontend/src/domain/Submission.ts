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

  static makeEmpty(): Submission {
    return new Submission({
      id: 0,
      artifactId: 1,
      taskId: 0,
      studentId: '',
      submissionDate: new Date(Date.now()),
      comment: ''
    });
  }

  hasFile(): boolean {
    return this.artifactId > 1;
  }

  submissionId: number;
  artifactId: number;
  taskId: number;
  studentId: string;
  submissionDate: Date;
  comment: string;
}
