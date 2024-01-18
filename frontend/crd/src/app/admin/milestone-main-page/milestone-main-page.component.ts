import { Component, OnInit } from '@angular/core';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-milestone-main-page',
  templateUrl: './milestone-main-page.component.html',
  styleUrls: ['./milestone-main-page.component.less']
})
export class MilestoneMainPageComponent {
  constructor(
    private milestoneService: MilestoneService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.milestoneService.getMilestones().subscribe((milestones: Milestone[]) => {
      this.yearLevels.forEach((yearLevel) => this.milestonesMap.set(yearLevel, new Array<Milestone>()));
      milestones.forEach((milestone) => this.milestonesMap.get(milestone.yearLevel)?.push(milestone));
    });
  }

  editMilestone(name: string) {
    const encodedName = encodeURIComponent(name);
    this.router.navigate(['/admin/milestone-edit', encodedName]);
  }

  milestonesMap: Map<string, Array<Milestone>> = new Map()

  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];

}
