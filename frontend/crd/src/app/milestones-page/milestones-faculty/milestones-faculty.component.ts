import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from '../milestones/milestone.service';
import { Subject, mergeMap, takeUntil, zip } from 'rxjs';
import { MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { TasksModalComponent } from "../../tasks-modal/tasks-modal.component";
import { SubmissionService } from 'src/app/submissions/submission.service';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';
import { Submission } from 'src/domain/Submission';
import { MilestonesPageComponent } from '../milestones-page.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faculty-milestones',
  templateUrl: './milestones-faculty.component.html',
  styleUrls: ['./milestones-faculty.component.less']
})
export class MilestonesFacultyComponent extends MilestonesPageComponent implements OnInit, OnDestroy {

  studentID!: string;

  constructor(
    milestoneService: MilestoneService,
    matDialog: MatDialog,
    submissionService: SubmissionService,
    protected route: ActivatedRoute,
  ) {
    super(milestoneService, matDialog, submissionService);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // actually the milestone id
      this.studentID = decodeURIComponent(params['id']);
    });

    zip(
      this.submissionService.getStudentSubmissionsFaculty(this.studentID),
      this.milestoneService.getMilestones()
        .pipe(takeUntil(this.destroyed$))
    ).subscribe(([submissions, milestones]) => {
      this.yearLevels.forEach((yearLevel) => this.milestonesMap.set(yearLevel, new Array<Milestone>()));
      milestones.forEach((milestone) => this.milestonesMap.get(milestone.yearLevel)?.push(milestone));

      this.checkCompleted(submissions);
      this.dataLoaded = true;
    });
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

    modalDialog.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }
}
