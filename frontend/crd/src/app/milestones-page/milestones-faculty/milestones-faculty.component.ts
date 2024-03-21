import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel, CompletionStatus } from "../../../domain/Milestone";
import { MilestoneService } from '../milestones/milestone.service';
import { takeUntil, zip } from 'rxjs';
import { MatDialog} from "@angular/material/dialog";
import { SubmissionService } from 'src/app/submissions/submission.service';
import { User } from 'src/app/security/domain/user';
import { MilestonesPage } from '../milestones-page';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/security/user.service';

@Component({
  selector: 'app-faculty-milestones',
  templateUrl: './milestones-faculty.component.html',
  styleUrls: ['./milestones-faculty.component.less']
})
export class MilestonesFacultyComponent extends MilestonesPage implements OnInit, OnDestroy {

  studentID!: string;
  currentStudent!: User;
  studentYear!: YearLevel;

  // display order
  completionStatuses = [
    CompletionStatus.InProgress, 
    CompletionStatus.Incomplete, 
    CompletionStatus.Complete,
    CompletionStatus.Upcoming
  ];
  completedMap: Map<CompletionStatus, Array<Milestone>> = new Map();

  constructor(
    milestoneService: MilestoneService,
    matDialog: MatDialog,
    submissionService: SubmissionService,
    protected route: ActivatedRoute,
    protected userService: UserService
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
      this.userService.getUser(this.studentID),
      this.milestoneService.getMilestones()
        .pipe(takeUntil(this.destroyed$))
    ).subscribe(([submissions, student, milestones]) => {
      if (student && student.studentDetails?.yearLevel) {
        this.currentStudent = student;
        this.studentYear = student.studentDetails?.yearLevel;
      }
      
      this.makeMilestoneMap(milestones);
      this.checkCompleted(submissions);
      this.sortMilestones(milestones);
      this.dataLoaded = true;
    });
  }

  sortMilestones(milestones: Milestone[]) {
    const inprogressMilestones: Milestone[] = [];

    // get the milestone object for the completed milestones
    const completedMilestonesList = milestones.filter(milestone => 
      this.completedMilestones.includes(milestone.milestoneID)
    );

    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i];
      const completedMTasks = milestone.tasks.filter(task => this.completedTasks.includes(task.taskID));

      // if the milestone has any completed tasks but hasn't been marked as fully completed
      if (completedMTasks.length > 0 && 
        !this.completedMilestones.includes(milestone.milestoneID)) {
          inprogressMilestones.push(milestone);
        }
    }

    const incompleteMilestones: Milestone[] = [];
    const upcomingMilestones: Milestone[] = [];

    // if the milestone isn't already in either list
    milestones.filter(milestone => 
      !this.completedMilestones.includes(milestone.milestoneID) &&
      !inprogressMilestones.includes(milestone)
    ).forEach((milestone) => {
      if (YearLevel.compare(milestone.yearLevel, this.studentYear) > 0) {
        upcomingMilestones.push(milestone);
      }
      else {
        incompleteMilestones.push(milestone);
      }
    });
    
    this.completedMap.set(CompletionStatus.InProgress, inprogressMilestones);
    this.completedMap.set(CompletionStatus.Incomplete, incompleteMilestones);
    this.completedMap.set(CompletionStatus.Complete, completedMilestonesList);
    this.completedMap.set(CompletionStatus.Upcoming, upcomingMilestones);
  }

  openTask(task: any) {
    console.log("replace with view submission");
  }
}
