import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from "./milestone.service";
import { Subject, mergeMap, takeUntil, zip } from 'rxjs';
import { MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { TasksModalComponent } from "../../tasks-modal/tasks-modal.component";

import { SubmissionService } from 'src/app/submissions/submission.service';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';
import { Submission } from 'src/domain/Submission';

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.less']
})
export class MilestonesComponent implements OnInit, OnDestroy {

  private destroyed$ = new Subject<any>();
  dataLoaded = false;

  constructor(
    private milestoneService: MilestoneService,
    public matDialog: MatDialog,
    private submissionService: SubmissionService,
    private authService: AuthService,
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next("");
    this.destroyed$.complete();
  }

  ngOnInit() {
    zip(this.authService.user$.pipe(
        mergeMap((user) => {
          return this.submissionService.getStudentSubmissions(user!.id);
        })
      ),
      this.milestoneService.getMilestones()
        .pipe(takeUntil(this.destroyed$))
    ).subscribe(([submissions, milestones]) => {
      this.yearLevels.forEach((yearLevel) => this.milestonesMap.set(yearLevel, new Array<Milestone>()));
      milestones.forEach((milestone) => this.milestonesMap.get(milestone.yearLevel)?.push(milestone));

      this.checkCompleted(submissions);
      this.dataLoaded = true;
    });
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

  openTask(task: any) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "80%";
    dialogConfig.width = "60%";
    dialogConfig.data = {
      task: task
    }
    const modalDialog = this.matDialog.open(TasksModalComponent, dialogConfig);
  }
    milestonesMap: Map<string, Array<Milestone>> = new Map()
  completedTasks!: number[];
  completedMilestones: number[] = [];
  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];
}
