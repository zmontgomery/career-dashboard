export interface EventJSON {
  activityID: string;
  description: string;
  needsArtifact: Boolean;
  date: string;
  eventID: string;
  isRecurring: Boolean;
  organizer: string;
  location: string;
  isRequired: Boolean;
}

export class Event {
  constructor(json: EventJSON) {
    this.activityID = json.activityID;
    this.description = json.description;
    this.needsArtifact = json.needsArtifact;
    this.date = new Date(json.date);
    this.eventID = json.eventID;
    this.isRecurring = json.isRecurring;
    this.organizer = json.organizer;
    this.location = json.location;
    this.isRequired = json.isRequired;
  }

  activityID: string;
  description: string;
  needsArtifact: Boolean;
  date: Date;
  eventID: string;
  isRecurring: Boolean;
  organizer: string;
  location: string;
  isRequired: Boolean;
}
