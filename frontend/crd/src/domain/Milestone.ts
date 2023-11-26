import {Event, EventJSON} from "./Event";
import {Task, TaskJSON} from "./Task";

export interface MilestoneJSON {
  name: string;
  yearLevel: YearLevel;
  milestoneID: string;
  events: Array<EventJSON>;
  tasks: Array<TaskJSON>;
}

export enum YearLevel {
  Freshman = "Freshman", Sophomore = "Sophomore",
  Junior = "Junior", Senior = "Senior"
}

export class Milestone {
  constructor(json: MilestoneJSON) {
    this.name = json.name;
    this.yearLevel = json.yearLevel;
    this.milestoneID = json.milestoneID;
    this.events = json.events?.map((event) => new Event(event));
    this.tasks = json.tasks?.map((task) => new Task(task));
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = false;
  }

    name: string;
    yearLevel: YearLevel;
    milestoneID: string;
    events: Array<Event>;
    tasks: Array<Task>;
    isComplete: boolean;
}
