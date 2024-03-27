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
import {MatSnackBarModule} from "@angular/material/snack-bar";
import any = jasmine.any;
import anything = jasmine.anything;


describe('TaskEditModalComponent', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
  let eventServiceSpy = createSpyObj('EventService', ['getEvents']);
  // @ts-ignore
  let snackBarSpy: Jasmine.Spy<MatSnackBar>;

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
    artifactName: 'test artifact',
    submissionInstructions: 'instructions'
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
        MatSnackBarModule,
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
    // @ts-ignore
    snackBarSpy = spyOn(component._snackBar, 'open');
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
        artifactName: 'test artifact',
        submissionInstructions: 'instructions'
      });
    component.createForm();

    const sampleForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.ARTIFACT],
      artifactName: ['test artifact'],
      event: [null],
      instructions: [null]
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
      taskType: [TaskType.ARTIFACT],
      artifactName: [null],
      event: [null],
      instructions: [null]
    });

    expect(component.taskForm.get('name')!.value).toEqual(sampleForm.get('name')!.value);
    expect(component.taskForm.get('artifactName')!.value).toEqual(sampleForm.get('artifactName')!.value);

    expect(component.getTaskType()).toEqual(TaskType.ARTIFACT);
  });

  it('should save artifact task', () => {
    component.currentTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.ARTIFACT,
      artifactName: 'test artifact',
      submissionInstructions: 'instructions'
    });
    component.createForm();

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.ARTIFACT],
      artifactName: ['test artifact'],
      event: [null],
      instructions: ['test']
    });

    let spy = spyOn(component.http, 'post').and.returnValue(of(null));

    component.saveTask();
    expect(spy).toHaveBeenCalled();
  });

  it('should save event task', () => {
    component.currentTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.EVENT,
      eventID: 1,
      submissionInstructions: 'instructions'
    });
    component.createForm();

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.EVENT],
      artifactName: [null],
      event: [1],
      instructions: ['instructions']
    });

    let spy = spyOn(component.http, 'post').and.returnValue(of(null));

    component.saveTask();
    expect(spy).toHaveBeenCalled();
  });

  it('should save comment task', () => {
    component.currentTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.COMMENT,
      submissionInstructions: 'instructions'
    });
    component.createForm();

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.COMMENT],
      artifactName: [null],
      event: [null],
      instructions: ['instructions']
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
      artifactName: 'test artifact',
      submissionInstructions: 'instructions'
    });

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.ARTIFACT],
      artifactName: [null],
      event: [null],
      instructions: ['test']
    });

    component.saveTask();
    expect(snackBarSpy).toHaveBeenCalledWith("Please add an artifact name", anything(), anything());
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
      eventID: 1,
      submissionInstructions: 'instructions'
    });

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.EVENT],
      artifactName: [null],
      event: [null],
      instructions: ['test']
    });

    component.saveTask();
    expect(snackBarSpy).toHaveBeenCalledWith("Please select an event", anything(), anything());
  });

  it('should block saving without instructions', () => {
    component.currentTask = new Task({
      name: 'task name',
      description: "description",
      id: 1,
      isRequired: true,
      yearLevel: YearLevel.Freshman,
      milestoneID: 1,
      taskType: TaskType.EVENT,
      eventID: 1,
      submissionInstructions: 'instructions'
    });

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.EVENT],
      artifactName: [null],
      event: [null],
      instructions: [null]
    });

    component.saveTask();
    expect(snackBarSpy).toHaveBeenCalledWith("Please add submission instructions", anything(), anything());
  });

  it('should create artifact task', () => {
    component.currentTask = undefined;

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.ARTIFACT],
      artifactName: ['test artifact'],
      event: [null],
      instructions: ['test']
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
      taskType: [TaskType.EVENT],
      artifactName: [null],
      event: [1],
      instructions: ['test']
    });

    let spy = spyOn(component.http, 'post').and.returnValue(of(null));

    component.saveTask();
    expect(spy).toHaveBeenCalled();
  });

  it('should create comment task', () => {
    component.currentTask = undefined;

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.COMMENT],
      artifactName: [null],
      event: [null],
      instructions: ['test']
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
      taskType: [TaskType.EVENT],
      artifactName: [null],
      event: [null],
      instructions: ['test']
    });

    component.saveTask();
    expect(snackBarSpy).toHaveBeenCalledWith("Please add a task name", anything(), anything());
  });


  it('should block create without artifact name', () => {
    component.currentTask = undefined

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.ARTIFACT],
      artifactName: [null],
      event: [null],
      instructions: ['test']
    });

    component.saveTask();
    expect(snackBarSpy).toHaveBeenCalledWith("Please add an artifact name", anything(), anything());
  });

  it('should block create without event', () => {
    component.currentTask = undefined

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.EVENT],
      artifactName: [null],
      event: [null],
      instructions: ['test']
    });

    component.saveTask();
    expect(snackBarSpy).toHaveBeenCalledWith("Please select an event", anything(), anything());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should block create without instructions', () => {
    component.currentTask = undefined

    component.taskForm = formBuilder.group({
      name: ['task name'],
      description: ['description'],
      taskType: [TaskType.ARTIFACT],
      artifactName: ['something'],
      event: [null],
      instructions: [null]
    });

    component.saveTask();
    expect(snackBarSpy).toHaveBeenCalledWith("Please add submission instructions", anything(), anything());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


