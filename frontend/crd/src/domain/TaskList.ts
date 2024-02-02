import {Task, TaskJSON} from "./Task";

export interface TaskListJSON {
  name: string;
  milestoneID: string;
  tasks: Array<TaskJSON>;
}

export class TaskList {
  constructor(json: TaskListJSON) {
    this.name = json.name;
    this.milestoneID = json.milestoneID;
    this.tasks = json.tasks?.map((task) => new Task(task));
    this.isComplete = false;
  }

  name: string;
  milestoneID: string;
  tasks: Array<Task>;
  isComplete: boolean;
}
