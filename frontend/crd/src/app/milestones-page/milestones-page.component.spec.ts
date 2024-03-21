import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestonesPageComponent } from './milestones-page.component';
import {MilestonesComponent} from "./milestones/milestones.component";
import {MockComponent} from "ng-mocks";
import { MilestonesFacultyComponent } from './milestones-faculty/milestones-faculty.component';
import { Milestone, YearLevel } from 'src/domain/Milestone';
import { TaskType } from 'src/domain/Task';
import { Submission } from 'src/domain/Submission';
import { ActivatedRoute } from '@angular/router';
import { MilestoneService } from './milestones/milestone.service';
import { SubmissionService } from '../submissions/submission.service';
import { AuthService } from '../security/auth.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('MilestonesPageComponent', () => {
  let component: MilestonesPageComponent;
  let fixture: ComponentFixture<MilestonesPageComponent>;

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

  const testFreshmanMilestones = [
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
  ];

  const testSophomoreMilestones = [
    new Milestone({
      name: "name",
      yearLevel: YearLevel.Sophomore,
      id: 3,
      description: "sample",
      events: [],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 5,
        isRequired: true,
        yearLevel: YearLevel.Sophomore,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      },
      {
        name: 'task name',
        description: "description",
        id: 6,
        isRequired: true,
        yearLevel: YearLevel.Sophomore,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      }],
    }),
  ];

  const testMilestones = testFreshmanMilestones.concat(testSophomoreMilestones);

  const testMap = new Map();
  testMap.set(YearLevel.Freshman, testFreshmanMilestones);
  testMap.set(YearLevel.Sophomore, testSophomoreMilestones);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [MilestonesPageComponent, MockComponent(MilestonesComponent), MockComponent(MilestonesFacultyComponent)],
      providers: [
        {provide: MilestoneService, useValue: []},
        {provide: SubmissionService, useValue: []},
      ],
    });
    fixture = TestBed.createComponent(MilestonesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create milestone map', () => {
    component.makeMilestoneMap(testMilestones);
    
    expect(component.milestonesMap.size).toEqual(4);
    expect(component.milestonesMap.get(YearLevel.Freshman)).toEqual(testFreshmanMilestones);
    expect(component.milestonesMap.get(YearLevel.Sophomore)).toEqual(testSophomoreMilestones);
  });

  it('should check completed', () => {
    component.milestonesMap = testMap;

    component.checkCompleted(testSubmissions);

    expect(component.completedMilestones).toEqual([1]);
    expect(component.completedTasks).toEqual([1, 2, 3]);
  });
});
