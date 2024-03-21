import { Component } from '@angular/core';
import { MilestoneService } from './milestones/milestone.service';
import { MatDialog } from '@angular/material/dialog';
import { SubmissionService } from '../submissions/submission.service';
import { AuthService } from '../security/auth.service';
import { Milestone, YearLevel } from 'src/domain/Milestone';
import { Submission } from 'src/domain/Submission';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: ''
})
export abstract class MilestonesPage {

  milestonesMap: Map<string, Array<Milestone>> = new Map()
  completedTasks!: number[];
  completedMilestones: number[] = [];
  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];

  protected destroyed$ = new Subject<any>();
  dataLoaded = false;

  ngOnDestroy(): void {
    this.destroyed$.next("");
    this.destroyed$.complete();
  }

  constructor(
    protected milestoneService: MilestoneService,
    public matDialog: MatDialog,
    protected submissionService: SubmissionService,
  ) {
  }

  makeMilestoneMap(milestones: Milestone[]) {
    this.yearLevels.forEach((yearLevel) => this.milestonesMap.set(yearLevel, new Array<Milestone>()));
    milestones.forEach((milestone) => this.milestonesMap.get(milestone.yearLevel)?.push(milestone));
  }

  checkCompleted(submissions: Submission[]) {
    this.completedTasks = submissions.map(submission => submission.taskId);

    this.milestonesMap.forEach((yearMilestones) => {
      yearMilestones.flatMap((milestone) => {
        const milestoneTasks = milestone.tasks.map(task => task.taskID);

        const completed = milestoneTasks.every(taskID => this.completedTasks.includes(taskID));
        if (completed) {
          this.completedMilestones.push(milestone.milestoneID);
        }
      })
    })
  }

}
