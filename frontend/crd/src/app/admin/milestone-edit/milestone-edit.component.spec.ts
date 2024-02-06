import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MilestoneEditComponent } from './milestone-edit.component';
import { BehaviorSubject, of } from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import { Milestone, YearLevel } from 'src/domain/Milestone';
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service';
import { Task } from 'src/domain/Task';
import { TaskService } from 'src/app/util/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";



describe('MilestoneEditComponent', () => {
  let component: MilestoneEditComponent;
  let fixture: ComponentFixture<MilestoneEditComponent>;
  const paramMap = new BehaviorSubject(convertToParamMap({ name: 'name'  }));
  const activatedRouteMock = {
    params: paramMap.asObservable(),
  };

  let milestoneServiceSpy = createSpyObj('MilestoneService', ['getMilestones']);
  milestoneServiceSpy.getMilestones.and.returnValue(of(Array(new Milestone({
    name: "name",
    yearLevel: YearLevel.Freshman,
    id: 1,
    events: [],
    tasks: [],
    description: "testing"
  }))));

  let taskServiceSpy = createSpyObj('TaskService', ['getTasks']);
  taskServiceSpy.getTasks.and.returnValue(of(Array(new Task({
    name: 'task name',
    description: "description",
    id: 1,
    isRequired: true,
    submission: 'submission',
    yearLevel: YearLevel.Freshman,
    milestoneID: 1,
    taskType: 'artifact',
    artifactName: 'test artifact'
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule, 
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        NoopAnimationsModule
      ],
      declarations: [MilestoneEditComponent],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRouteMock},
        {provide: MilestoneService, useValue: milestoneServiceSpy},
        {provide: TaskService, useValue: taskServiceSpy}
      ]
    });
    fixture = TestBed.createComponent(MilestoneEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
