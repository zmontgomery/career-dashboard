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
  selector: 'app-milestones-page',
  templateUrl: './milestones-page.component.html',
  styleUrls: ['./milestones-page.component.less']
})
export class MilestonesPageComponent {

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
    protected route: ActivatedRoute,
    protected milestoneService: MilestoneService,
    public matDialog: MatDialog,
    protected submissionService: SubmissionService,
    protected authService: AuthService,
  ) {
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
