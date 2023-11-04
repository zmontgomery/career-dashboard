import {Component, OnInit} from '@angular/core';
import {MilestoneService} from "./MilestoneService";
import {Milestone, YearLevel} from "../../../domain/Milestone";

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.less']
})
export class MilestonesComponent implements OnInit {

  constructor(
    private milestoneService: MilestoneService,
  ) {
  }

  ngOnInit() {
    this.milestoneService.getMilestones().subscribe((milestones: Milestone[]) => {
      this.yearLevels.forEach((yearLevel) => this.milestonesMap.set(yearLevel, new Array<Milestone>()))
      milestones.forEach((milestone) => this.milestonesMap.get(milestone.yearLevel)?.push(milestone))
    });
  }

  milestonesMap: Map<string, Array<Milestone>> = new Map()

  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];
}
