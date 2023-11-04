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
      this.milestones = milestones;
    });
  }

  milestones: Array<Milestone> = []

  protected readonly YearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];
}
