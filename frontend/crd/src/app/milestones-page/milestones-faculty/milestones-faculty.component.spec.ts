import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonesFacultyComponent } from './milestones-faculty.component';
import { BehaviorSubject, of } from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MilestoneService } from '../milestones/milestone.service';
import { MatDialogModule } from '@angular/material/dialog';
import { SubmissionService } from 'src/app/submissions/submission.service';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';
import { userJSON } from 'src/app/security/auth.service.spec';
import { TaskType } from 'src/domain/Task';
import { Submission } from 'src/domain/Submission';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('MilestonesFacultyComponent', () => {
  let component: MilestonesFacultyComponent;
  let fixture: ComponentFixture<MilestonesFacultyComponent>;
  let submissionService: jasmine.SpyObj<SubmissionService>;
  let authService: jasmine.SpyObj<AuthService>;

  let user = new User(userJSON);

  const paramMap = new BehaviorSubject(convertToParamMap({ id: 'id'  }));
  const activatedRouteMock = {
    params: paramMap.asObservable(),
  };

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

  const testMap = new Map().set(YearLevel.Freshman, [
    new Milestone({
      name: "name",
      yearLevel: YearLevel.Freshman,
      id: 1,
      description: "sample",
      events: [],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      },
      {
        name: 'task name',
        description: "description",
        id: 2,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      }],
    }),
    new Milestone({
      name: "name",
      yearLevel: YearLevel.Freshman,
      id: 2,
      description: "sample",
      events: [],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 3,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 2,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      },
      {
        name: 'task name',
        description: "description",
        id: 4,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 2,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      }],
    })
  ]);
  
  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  milestoneServiceSpy.getMilestones.and.returnValue(of([]));

  let submissionsServiceSpy = createSpyObj('SubmissionService', ['getStudentSubmissionsFaculty']);
  submissionsServiceSpy.getStudentSubmissionsFaculty.and.returnValue(of(testSubmissions));

  beforeEach(() => {
    submissionService = jasmine.createSpyObj('SubmissionService', ['submit']);
    authService = jasmine.createSpyObj('AuthService', ['toString'], {user$: of(user)});

    TestBed.configureTestingModule({
      imports: [MatCardModule, MatExpansionModule, MatCheckboxModule, NoopAnimationsModule, MatDialogModule],
      providers: [
        {provide: MilestoneService, useValue: milestoneServiceSpy},
        {provide: SubmissionService, useValue: submissionsServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteMock},
      ],
      declarations: [MilestonesFacultyComponent]
    });
    fixture = TestBed.createComponent(MilestonesFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
