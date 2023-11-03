import {Event} from "./Event";
import {Task} from "./Task";

export interface MilestoneJSON {
  name: string;
  yearLevel: YearLevel;
  milestoneID: string;
  active: Boolean;
  events: Array<Event>;
  tasks: Array<Task>;
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
    this.active = json.active;
    this.events = json.events;
    this.tasks = json.tasks;
  }

    name: string;
    yearLevel: YearLevel;
    milestoneID: string;
    active: Boolean;
    events: Array<Event>;
    tasks: Array<Task>;
    expanded = false;
}
