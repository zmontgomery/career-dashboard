import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskEditModalComponent } from './task-edit-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Form, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Task, TaskType } from 'src/domain/Task';
import { YearLevel } from 'src/domain/Milestone';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import createSpyObj = jasmine.createSpyObj;
import { EventService } from 'src/app/dashboard/events/event.service';
import { Event } from 'src/domain/Event';


describe('TaskEditModalComponent', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
  let eventServiceSpy = createSpyObj('EventService', ['getEvents']);
  eventServiceSpy.getEvents.and.returnValue(of(Array(new Event({
    name: "name",
    description: "description",
    date: new Date().toDateString(),
    id: 1,
    recurring: true,
    organizer: "organizer",
    location: "location",
    eventLink: "sample",
    buttonLabel: "sample",
    imageId: 1,
  }))));
  let dialogMock = {
    close: () => { }
    };
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

  const dialogData = {
    name: "testing",
    task: testTask
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskEditModalComponent],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatDialogModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatInputModule,
        ReactiveFormsModule,
        MatRadioModule,
        NoopAnimationsModule,
        MatSelectModule
      ],
      providers: [
        MatDialog,
        FormBuilder,
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: dialogData},
        {provide: EventService, useValue: eventServiceSpy},
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(TaskEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should list events', () => {
    const testEvents = Array(new Event({
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      id: 1,
      recurring: true,
      organizer: "organizer",
      location: "location",
      eventLink: "sample",
      buttonLabel: "sample",
      imageId: 1,
    }));

    expect(component.eventList).toEqual(testEvents);
  });

  it('should build form from task', () => {
    component.currentTask = new Task({
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: TaskType.ARTIFACT,
        artifactName: 'test artifact'
      });
    component.createForm();

    const sampleForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: ['artifact'],
      artifactName: ['test artifact'],
      event: [null]
    });

    expect(component.taskForm.get('description')!.value).toEqual(sampleForm.get('description')!.value);
    expect(component.taskForm.get('artifactName')!.value).toEqual(sampleForm.get('artifactName')!.value);
  });

  it('should build blank form', () => {
    component.currentTask = undefined;

    component.createForm();

    const sampleForm = formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      taskType: ['artifact'],
      artifactName: [null],
      event: [null]
    });

    expect(component.taskForm.get('name')!.value).toEqual(sampleForm.get('name')!.value);
    expect(component.taskForm.get('artifactName')!.value).toEqual(sampleForm.get('artifactName')!.value);

    expect(component.getTaskType()).toEqual('artifact')
  });

  it('should save task', () => {
    component.currentTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    });
    component.createForm();

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: ['artifact'],
      artifactName: ['test artifact'],
      event: [null]
    });

    let spy = spyOn(component.http, 'post').and.returnValue(of(null));

    component.saveTask();
    expect(spy).toHaveBeenCalled();
  });

  it('should block saving without artifact name', () => {
    component.currentTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact'
    });

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: ['artifact'],
      artifactName: [null],
      event: [null]
    });

    let spyWindow = spyOn(window, 'alert');

    component.saveTask();
    expect(spyWindow).toHaveBeenCalledWith("Please add an artifact name");
  });

  it('should block saving without event', () => {
    component.currentTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.EVENT,
      eventID: 1
    });

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: ['event'],
      artifactName: [null],
      event: [null]
    });

    let spyWindow = spyOn(window, 'alert');

    component.saveTask();
    expect(spyWindow).toHaveBeenCalledWith("Please select an event");
  });

  it('should create artifact task', () => {
    component.currentTask = undefined;

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: ['artifact'],
      artifactName: ['test artifact'],
      event: [null]
    });

    let spy = spyOn(component.http, 'post').and.returnValue(of(null));

    component.saveTask();
    expect(spy).toHaveBeenCalled();
  });

  it('should create event task', () => {
    component.currentTask = undefined;

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: ['event'],
      artifactName: [null],
      event: [1]
    });

    let spy = spyOn(component.http, 'post').and.returnValue(of(null));

    component.saveTask();
    expect(spy).toHaveBeenCalled();
  });

  it('should block create without name', () => {
    component.currentTask = undefined

    component.taskForm = formBuilder.group({
      name: [null],
      description: ['description'],
      taskType: ['event'],
      artifactName: [null],
      event: [null]
    });

    let spyWindow = spyOn(window, 'alert');

    component.saveTask();
    expect(spyWindow).toHaveBeenCalledWith("Please add a task name");
  });


  it('should block create without artifact name', () => {
    component.currentTask = undefined

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: ['artifact'],
      artifactName: [null],
      event: [null]
    });

    let spyWindow = spyOn(window, 'alert');

    component.saveTask();
    expect(spyWindow).toHaveBeenCalledWith("Please add an artifact name");
  });

  it('should block create without event', () => {
    component.currentTask = undefined

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: ['event'],
      artifactName: [null],
      event: [null]
    });

    let spyWindow = spyOn(window, 'alert');

    component.saveTask();
    expect(spyWindow).toHaveBeenCalledWith("Please select an event");
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


