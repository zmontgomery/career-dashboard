import {Component, OnInit} from '@angular/core';
import {MilestoneService} from "./MilestoneService";
import {Milestone} from "../../domain/Milestone";
import {EventService} from "./EventService";
import {Event} from "../../domain/Event";

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit{

  constructor(
    private milestoneService: MilestoneService,
    private eventService: EventService,
  ) {
  }

  ngOnInit() {
    this.milestoneService.getMilestones().subscribe((milestones: Milestone[]) => {
      this.milestones = milestones;
    });
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
      console.log(events);
    });
  }

  milestones: Array<Milestone> = []
  events: Array<Event> = []

}
