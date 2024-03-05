export interface EventJSON {
  name: string;
  description: string;
  date: string;
  id: number;
  recurring: boolean;
  organizer: string;
  location: string;
  eventLink: string;
  buttonLabel: string;
  imageId: number;
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
    this.eventLink = json.eventLink;
    this.buttonLabel = json.buttonLabel;
    this.imageId = json.imageId;
  }

  name: string;
  description: string;
  date: Date;
  eventID: number;
  isRecurring: boolean;
  organizer: string;
  location: string;
  isComplete: boolean;
  eventLink: string;
  buttonLabel: string;
  imageId: number;
}
