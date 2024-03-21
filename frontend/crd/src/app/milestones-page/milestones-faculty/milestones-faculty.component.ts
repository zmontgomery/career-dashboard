import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel, CompletionStatus } from "../../../domain/Milestone";
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
import { UserService } from 'src/app/security/user.service';

@Component({
  selector: 'app-faculty-milestones',
  templateUrl: './milestones-faculty.component.html',
  styleUrls: ['./milestones-faculty.component.less']
})
export class MilestonesFacultyComponent extends MilestonesPageComponent implements OnInit, OnDestroy {

  studentID!: string;
  currentStudent!: User;
  studentYear!: YearLevel;

  // display order
  completionStatuses = [CompletionStatus.InProgress, CompletionStatus.Incomplete, CompletionStatus.Complete];
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
      this.userService.getStudent(this.studentID),
      this.milestoneService.getMilestones()
        .pipe(takeUntil(this.destroyed$))
    ).subscribe(([submissions, student, milestones]) => {
      this.currentStudent = student;
      if (student.studentDetails?.yearLevel) {
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

    // if the milestone isn't already in either list
    const incompleteMilestones = milestones.filter(milestone => 
      !this.completedMilestones.includes(milestone.milestoneID) &&
      !inprogressMilestones.includes(milestone)
    );
    
    this.completedMap.set(CompletionStatus.InProgress, inprogressMilestones);
    this.completedMap.set(CompletionStatus.Incomplete, incompleteMilestones);
    this.completedMap.set(CompletionStatus.Complete, completedMilestonesList);
  }

  openTask(task: any) {
    console.log("replace with view submission");
  }
}
