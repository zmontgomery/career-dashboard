import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MilestonesFacultyComponent } from './milestones-faculty.component';
import { BehaviorSubject, of } from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import { CompletionStatus, Milestone, YearLevel } from "../../../domain/Milestone";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MilestoneService } from '../milestones/milestone.service';
import { MatDialogModule } from '@angular/material/dialog';
import { SubmissionService } from 'src/app/submissions/submission.service';
import { Role, User } from 'src/app/security/domain/user';
import { TaskType } from 'src/domain/Task';
import { Submission } from 'src/domain/Submission';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { UserService } from 'src/app/security/user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { StudentDetailsJSON } from 'src/domain/StudentDetails';

describe('MilestonesFacultyComponent', () => {
  let component: MilestonesFacultyComponent;
  let fixture: ComponentFixture<MilestonesFacultyComponent>;
  let submissionService: jasmine.SpyObj<SubmissionService>;
  let httpMock: HttpTestingController;

  const paramMap = new BehaviorSubject(convertToParamMap({ id: '1'  }));
  const activatedRouteMock = {
    params: paramMap.asObservable(),
  };

  const testStudentDetails: StudentDetailsJSON = {
    id: "1",
    universityId: "1",
    gpa: 4.0,
    graduationYear: new Date(),
    startDate: new Date(),
    yearLevel: YearLevel.Freshman,
    description: "test",
    projects: [],
    skills: [],
    jobs: [],
    degreePrograms: [],
    clubs: [],
    interests: []
  }

  const user = new User({
    id: "1",
    email: "sample",
    phoneNumber: "1234567890",
    dateCreated: 1,
    lastLogin: 1,
    firstName: "first",
    lastName: "last",
    preferredName: "first",
    signedUp: true,
    canEmail: true,
    canText: true,
    studentDetails: testStudentDetails,
    role: Role.Student,
    linkedin: "linkedin",
    profilePictureId: 0
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

  const inProgressMilestone = new Milestone({
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
  });

  const incompleteMilestone = new Milestone({
    name: "name",
    yearLevel: YearLevel.Freshman,
    id: 3,
    description: "sample",
    events: [],
    tasks: [{
      name: 'task name',
      description: "description",
      id: 4,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 3,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    }],
  });

  const completeMilstone = new Milestone({
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
  });

  const testMilestones = [completeMilstone, inProgressMilestone, incompleteMilestone]

  const testMap = new Map();
  testMap.set(CompletionStatus.InProgress, [inProgressMilestone]);
  testMap.set(CompletionStatus.Incomplete, [incompleteMilestone]);
  testMap.set(CompletionStatus.Complete, [completeMilstone]);
  
  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  let submissionsServiceSpy = createSpyObj('SubmissionService', ['getStudentSubmissionsFaculty']);
  let userServiceSpy = createSpyObj('UserService', ['getStudent']);

  beforeEach(() => {
    submissionService = jasmine.createSpyObj('SubmissionService', ['submit']);
    milestoneServiceSpy.getMilestones.and.returnValue(of([]));
    submissionsServiceSpy.getStudentSubmissionsFaculty.and.returnValue(of(testSubmissions));
    userServiceSpy.getStudent.and.returnValue(of(user));

    TestBed.configureTestingModule({
      imports: [
        MatCardModule, 
        MatExpansionModule, 
        MatCheckboxModule, 
        NoopAnimationsModule, 
        MatDialogModule,
        HttpClientTestingModule,
        HttpClientModule
      ],
      providers: [
        {provide: MilestoneService, useValue: milestoneServiceSpy},
        {provide: SubmissionService, useValue: submissionsServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteMock},
        {provide: UserService, userValue: userServiceSpy}
      ],
      declarations: [MilestonesFacultyComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(MilestonesFacultyComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // commented out until i figure out how to test the zip subscribe
  // it('should get student info', async() => {
  //   expect(component.studentID).toEqual("1");
  //   expect(component.currentStudent).toEqual(user);
  //   expect(component.studentYear).toEqual(YearLevel.Freshman);
  // });

  it('should sort milestones', () => {
    component.makeMilestoneMap(testMilestones);
    component.checkCompleted(testSubmissions);

    component.sortMilestones(testMilestones);
    
    expect(component.completedMap).toEqual(testMap);
  });

});
