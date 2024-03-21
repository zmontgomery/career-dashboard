import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonesComponent } from './milestones.component';
import { of } from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MilestoneService } from "./milestone.service";
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { SubmissionService } from 'src/app/submissions/submission.service';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';
import { userJSON } from 'src/app/security/auth.service.spec';
import { Task, TaskType } from 'src/domain/Task';
import { Submission } from 'src/domain/Submission';
import { TasksModalComponent } from 'src/app/tasks-modal/tasks-modal.component';
import { TasksModalModule } from 'src/app/tasks-modal/tasks-modal.module';

describe('MilestonesComponent', () => {
  let component: MilestonesComponent;
  let fixture: ComponentFixture<MilestonesComponent>;
  let submissionService: jasmine.SpyObj<SubmissionService>;
  let authService: jasmine.SpyObj<AuthService>;

  const user = new User(userJSON);

  const testTask = new Task({
    name: 'task name',
    description: "description",
    id: 1,
    isRequired: true,
    yearLevel: YearLevel.Freshman,
    milestoneID: 1,
    taskType: TaskType.ARTIFACT,
    artifactName: 'test artifact'
  });

  const testSubmissions = [
    new Submission({
      artifactId: 1,
      comment: "something",
      studentId: "dafaf2ef-db08-11ee-adf9-7cd30a80892f",
      submissionDate: new Date(),
      id: 1,
      taskId: 1,
    }),
    new Submission({
      artifactId: 1,
      comment: "hello",
      studentId: "dafaf2ef-db08-11ee-adf9-7cd30a80892f",
      submissionDate: new Date(),
      id: 2,
      taskId: 2,
    }),
    new Submission({
      artifactId: 1,
      comment: "testing",
      studentId: "dafaf2ef-db08-11ee-adf9-7cd30a80892f",
      submissionDate: new Date(),
      id: 3,
      taskId: 3,
    })
  ];
  
  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  milestoneServiceSpy.getMilestones.and.returnValue(of([]));

  let submissionsServiceSpy = createSpyObj('SubmissionService', ['getStudentSubmissions']);
  submissionsServiceSpy.getStudentSubmissions.and.returnValue(of(testSubmissions));

  beforeEach(() => {
    submissionService = jasmine.createSpyObj('SubmissionService', ['submit']);
    authService = jasmine.createSpyObj('AuthService', ['toString'], {user$: of(user)});

    TestBed.configureTestingModule({
      imports: [
        MatCardModule, 
        MatExpansionModule, 
        MatCheckboxModule, 
        NoopAnimationsModule, 
        MatDialogModule,
        TasksModalModule
      ],
      providers: [
        {provide: MilestoneService, useValue: milestoneServiceSpy},
        {provide: SubmissionService, useValue: submissionsServiceSpy},
        {provide: AuthService, useValue: authService},
      ],
      declarations: [MilestonesComponent]
    });
    fixture = TestBed.createComponent(MilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the TaskEditModal in a MatDialog', () => {
    spyOn(component.matDialog,'open').and.callThrough();
    component.openTask(testTask);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "80%";
    dialogConfig.width = "60%";
    dialogConfig.data = {
      task: testTask
    }

    expect(component.matDialog.open).toHaveBeenCalledWith(TasksModalComponent, dialogConfig);
  });
});
