import {Event, EventJSON} from "./Event";
import {Task, TaskJSON} from "./Task";

export interface MilestoneJSON {
  name: string;
  yearLevel: YearLevel;
  id: number;
  events: Array<EventJSON>;
  tasks: Array<TaskJSON>;
  description: string;
}

export enum YearLevel {
  Freshman = "Freshman", Sophomore = "Sophomore",
  Junior = "Junior", Senior = "Senior"
}

export class Milestone {
  constructor(json: MilestoneJSON) {
    this.name = json.name;
    this.yearLevel = json.yearLevel;
    this.milestoneID = json.id;
    this.events = json.events?.map((event) => new Event(event));
    this.tasks = json.tasks?.map((task) => new Task(task));
    this.description = json?.description;
  }

    name: string;
    yearLevel: YearLevel;
    milestoneID: number;
    events: Array<Event>;
    tasks: Array<Task>;
    description?: string;
}
