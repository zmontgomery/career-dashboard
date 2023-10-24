export interface EventJSON {
  name: string;
  description: string;
  date: string;
  eventID: string;
  isRecurring: Boolean;
  organizer: string;
  location: string;
  isRequired: Boolean;
}

export class Event {
  constructor(json: EventJSON) {
    this.name = json.name
    this.description = json.description;
    this.date = new Date(json.date);
    this.eventID = json.eventID;
    this.isRecurring = json.isRecurring;
    this.organizer = json.organizer;
    this.location = json.location;
    this.isRequired = json.isRequired;
  }

  name: string;
  description: string;
  date: Date;
  eventID: string;
  isRecurring: Boolean;
  organizer: string;
  location: string;
  isRequired: Boolean;
}
