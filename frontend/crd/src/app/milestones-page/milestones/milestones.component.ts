import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from "./milestone.service";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.less']
})
export class MilestonesComponent implements OnInit, OnDestroy {

  private destroyed$ = new Subject<any>();

  constructor(
    private milestoneService: MilestoneService,
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

  milestonesMap: Map<string, Array<Milestone>> = new Map()

  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];
}
