import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MilestoneEditComponent } from './milestone-edit.component';
import { BehaviorSubject, of } from "rxjs";
import createSpyObj = jasmine.createSpyObj;
import { Milestone, YearLevel } from 'src/domain/Milestone';
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service';
import { Task, TaskType } from 'src/domain/Task';
import { TaskService } from 'src/app/util/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TaskEditModalModule } from '../task-edit-modal/task-edit-modal.module';
import { MatDialog, MatDialogConfig, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TaskEditModalComponent } from '../task-edit-modal/task-edit-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MilestoneCreateModalComponent } from '../milestone-main-page/milestone-create-modal/milestone-create-modal.component';
import { MilestoneCreateModalModule } from '../milestone-main-page/milestone-create-modal/milestone-create-modal.module';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { Event } from 'src/domain/Event';


describe('MilestoneEditComponent', () => {
  let component: MilestoneEditComponent;
  let fixture: ComponentFixture<MilestoneEditComponent>;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
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
    yearLevel: YearLevel.Freshman,
    milestoneID: 1,
    taskType: TaskType.ARTIFACT,
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
        NoopAnimationsModule,
        HttpClientModule,
        TaskEditModalModule,
        MatDialogModule,
        HttpClientTestingModule, 
        HttpClientModule, 
        MilestoneCreateModalModule,
      ],
      declarations: [MilestoneEditComponent, MilestoneCreateModalComponent],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRouteMock},
        {provide: MilestoneService, useValue: milestoneServiceSpy},
        {provide: TaskService, useValue: taskServiceSpy},
        MatDialog,
        FormBuilder,
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(MilestoneEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list tasks', () => {
    component.currentMilestone = new Milestone({
      name: "name",
      yearLevel: YearLevel.Freshman,
      id: 1,
      description: "sample",
      events: [{
        name: "name",
        description: "description",
        date: new Date().toDateString(),
        id: 1,
        recurring: true,
        organizer: "organizer",
        location: "location",
        eventLink: "testing link",
        buttonLabel: "more info",
      }],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      }],
    });

    component.yearTasks = [new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    }),
    new Task({
      name: 'task name 2',
      description: "description",
      id: 2,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 2,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    }),
    new Task({
      name: 'task name 3',
      description: "description",
      id: 3,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    })];

    const componentTasks = component.listTasks();

    expect(componentTasks.controls[0].value).toEqual(true);
    expect(componentTasks.controls[1].value).toEqual(false);
    expect(componentTasks.controls[1].disabled).toEqual(true);
    expect(componentTasks.controls[2].value).toEqual(false);
    expect(componentTasks.controls[2].disabled).toEqual(false);
  });

  it('should create build form from milestone', () => {
    component.currentMilestone = new Milestone({
      name: "name",
      yearLevel: YearLevel.Freshman,
      id: 1,
      description: "sample",
      events: [{
        name: "name",
        description: "description",
        date: new Date().toDateString(),
        id: 1,
        recurring: true,
        organizer: "organizer",
        location: "location",
        eventLink: "sample",
        buttonLabel: "sample"
      }],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      }],
    });

    component.yearTasks = [new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    }),
    new Task({
      name: 'task name 2',
      description: "description",
      id: 2,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 2,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    })];
    
    const sampleForm = formBuilder.group({
      name: ["name", Validators.required],
      description: ["sample"],
      tasks: component.listTasks()
    });

    component.createMilestoneForm();

    expect(component.milestoneForm.get('name')!.value).toEqual(sampleForm.get('name')!.value);
    expect(component.milestoneForm.get('description')!.value).toEqual(sampleForm.get('description')!.value);
  });

  it('should update milestone', () => {
    component.currentMilestone = new Milestone({
      name: "name",
      yearLevel: YearLevel.Freshman,
      id: 1,
      description: "sample",
      events: [{
        name: "name",
        description: "description",
        date: new Date().toDateString(),
        id: 1,
        recurring: true,
        organizer: "organizer",
        location: "location",
        eventLink: "testing link",
        buttonLabel: "more info",
      }],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      }],
    });

    component.yearTasks = [new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    }),
    new Task({
      name: 'task name 2',
      description: "description",
      id: 2,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 2,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    })];

    component.createMilestoneForm();

    const testData = {
      description: "sample",
      id: 1,
      tasks: [1]
    }

    let spy = spyOn(component.http, 'post').and.returnValue(of({
      name: "name",
      yearLevel: YearLevel.Freshman,
      id: 1,
      description: "sample",
      events: [{
        name: "name",
        description: "description",
        date: new Date().toDateString(),
        id: 1,
        recurring: true,
        organizer: "organizer",
        location: "location",
        eventLink: "testing link",
        buttonLabel: "more info",
      }],
      tasks: [{
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      }],
    }));
    const url = constructBackendRequest(Endpoints.EDIT_MILESTONE);

    spyOn(component, 'back').and.callFake(function() { return null; });

    component.saveMilestone();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(url, testData);
  });

  it('should assign tasks', () => {
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

    const testE = {
      checked: true
    }

    component.assignTask(testE, testTask);
    expect(component.assignedTasks).toEqual([testTask]);

    testE.checked = false;

    component.assignTask(testE, testTask);
    expect(component.assignedTasks).toEqual([]);
  });

  it('should open the TaskEditModal in a MatDialog', () => {
    spyOn(component.matDialog,'open').and.callThrough();
    component.openTaskEditModal("testing", null);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      name: "testing",
      task: null
    }

    expect(component.matDialog.open).toHaveBeenCalledWith(TaskEditModalComponent, dialogConfig);
  });
});
