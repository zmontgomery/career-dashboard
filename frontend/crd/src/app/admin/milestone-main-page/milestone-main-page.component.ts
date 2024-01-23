import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service'; 
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-milestone-main-page',
  templateUrl: './milestone-main-page.component.html',
  styleUrls: ['./milestone-main-page.component.less']
})
export class MilestoneMainPageComponent implements OnDestroy {
  
  private destroyed$ = new Subject<any>();

  milestonesMap: Map<string, Array<Milestone>> = new Map()

  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];

  constructor(
    private milestoneService: MilestoneService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next("");
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.milestoneService.getMilestones()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((milestones: Milestone[]) => {
        this.yearLevels.forEach((yearLevel) => this.milestonesMap.set(yearLevel, new Array<Milestone>()));
        milestones.forEach((milestone) => this.milestonesMap.get(milestone.yearLevel)?.push(milestone));
    });
  }

  editMilestone(name: string) {
    const encodedName = encodeURIComponent(name);
    this.router.navigate(['/admin/milestone-edit', encodedName]);
  }

}
