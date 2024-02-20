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
import { Task } from 'src/domain/Task';
import { YearLevel } from 'src/domain/Milestone';
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';
import { of } from 'rxjs';


describe('TaskEditModalComponent', () => {
  let component: TaskEditModalComponent;
  let fixture: ComponentFixture<TaskEditModalComponent>;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
  let dialogMock = {
    close: () => { }
    };

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
        NoopAnimationsModule
      ],
      providers: [
        MatDialog,
        FormBuilder,
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(TaskEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should build form from task', () => {
    component.currentTask = new Task({
        name: 'task name',
        description: "description",
        id: 1,
        isRequired: true,
        submission: 'submission',
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: 'artifact',
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

  it('should build blank form', () => {
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
        submission: 'submission',
        yearLevel: YearLevel.Freshman,
        milestoneID: 1,
        taskType: 'artifact',
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


