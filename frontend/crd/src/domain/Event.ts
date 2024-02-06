export interface EventJSON {
  name: string;
  description: string;
  date: string;
  id: number;
  recurring: boolean;
  organizer: string;
  location: string;
}

export class Event {
  constructor(json: EventJSON) {
    this.name = json.name
    this.description = json.description;
    this.date = new Date(json.date);
    this.eventID = json.id;
    this.isRecurring = json.recurring;
    this.organizer = json.organizer;
    this.location = json.location;
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = false;
  }

  name: string;
  description: string;
  date: Date;
  eventID: number;
  isRecurring: boolean;
  organizer: string;
  location: string;
  isComplete: boolean;
}
